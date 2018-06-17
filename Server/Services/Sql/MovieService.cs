using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Database;
using BestOfTheWorst.Server.Models;
using Dapper;

namespace BestOfTheWorst.Server.Services.Sql
{
    public class MovieService : BaseService, IMovieService
    {
        public MovieService(IDbSession session) : base(session) { }

        public async Task<IEnumerable<Movie>> ListAllAsync()
        {
            var sql = @"select [Id], [Title] from [Movies] order by [Title]";

            return await Session.Connection.QueryAsync<Movie>(sql);
        }

        public async Task<PaginatedList<Movie>> ListAsync(int pageIndex, int pageSize)
        {
            var sql = @"select 
                            m.[Id],
                            m.[Title], 
                            m.[Synopsis],
                            i.[Id],
                            i.[FileName],
                            i.[Path]
                        from [Movies] m
                        left join [Images] i on m.[ImageId] = i.[Id]
                        order by m.[Title]
                        offset @pageSize * (@pageIndex - 1) rows
                        fetch next @pageSize rows only;
                        
                        select count(id) from [Movies];";

            var results = await Session.Connection.QueryMultipleAsync(sql, new { pageIndex, pageSize });

            var movies = results.Read<Movie, Image, Movie>((m, i) => {  
                m.Image = i;
                return m;
            }).ToList();

            var totalCount = results.Read<int>().FirstOrDefault();

            return new PaginatedList<Movie>(movies, totalCount, pageIndex, pageSize);
        }

        public async Task<Movie> GetByIdAsync(long id)
        {
            var sql = @"select 
                            m.[Id],
                            m.[Title], 
                            m.[Synopsis],
                            i.[Id],
                            i.[FileName],
                            i.[Path]
                        from [Movies] m
                        left join [Images] i on m.[ImageId] = i.[Id]
                        where m.[Id] = @id;

                        select distinct t.[Id], t.[Name] from MovieTag mt 
                        join [Tags] t on mt.[TagId] = t.[Id]
                        where mt.[MovieId] = @id;";

            var results = await Session.Connection.QueryMultipleAsync(sql, new { id });

            var movie = results.Read<Movie, Image, Movie>((m, i) => {
                m.Image = i;
                return m;
            }).FirstOrDefault();

            if (movie != null) {
                movie.Tags = results.Read<Tag>().ToList();
            }
            
            return movie;
        }

        public async Task<Movie> CreateAsync(Movie movieToCreate)
        {
            var sql = @"INSERT INTO [Movies]
                            ([Title]
                            ,[Synopsis]
                            ,[ImageId]
                            ,[EpisodeId])
                        VALUES
                            (@Title
                             ,@Synopsis
                             ,@ImageId
                             ,@EpisodeId);
                        select scope_identity();";

            movieToCreate.Id = await Session.Connection.QueryFirstOrDefaultAsync<long>(sql, movieToCreate);

            foreach (var tag in movieToCreate.Tags)
            {
                var existingTag = await GetTagByNameAsync(tag.Name);
                if (existingTag == null)
                {
                    existingTag = await CreateTagAsync(tag);
                    tag.Id = existingTag.Id;
                }

                await CreateMovieTag(new MovieTag
                {
                    MovieId = movieToCreate.Id,
                    TagId = tag.Id
                });
            }

            return movieToCreate;
        }

        private async Task CreateMovieTag(MovieTag movieTagToCreate)
        {
            var sql = @"INSERT INTO [MovieTag] ([MovieId], [TagId]) VALUES(@MovieId, @TagId)";
            await Session.Connection.ExecuteAsync(sql, movieTagToCreate);
        }

        private async Task<Tag> GetTagByNameAsync(string name)
        {
            var sql = @"select [Id], [Name] from [Tags] where [Name] = @name";
            return await Session.Connection.QueryFirstOrDefaultAsync<Tag>(sql, new { name });
        }

        private async Task<Tag> CreateTagAsync(Tag tagToCreate)
        {
            var sql = @"INSERT INTO [Tags]
                            ([Name])
                        VALUES
                            (@Name);
                        select scope_identity();";
            
            tagToCreate.Id = await Session.Connection.QueryFirstOrDefaultAsync<long>(sql, tagToCreate);
            return tagToCreate;
        }

        public async Task<long> UpdateAsync(Movie movieToUpdate)
        {
            var sql = @"update [Movies] 
                        set [Title] = @Title
                            ,[Synopsis] = @Synopsis
                            ,[EpisodeId] = @EpisodeId
                        where [Id] = @Id";
            
            await Session.Connection.ExecuteAsync(sql, movieToUpdate);
            return movieToUpdate.Id;
        }

        public async Task<long> DeleteAsync(long id)
        {
            var sql = @"delete from [Movie] where [Id] = @id";

            await Session.Connection.ExecuteAsync(sql, new { id });

            return id;
        }
    }
}