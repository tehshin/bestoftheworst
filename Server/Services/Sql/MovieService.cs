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
        private readonly ITagService _tagService;

        public MovieService(IDbSession session, ITagService tagService) : base(session) 
        {
            _tagService = tagService;
        }

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
                            e.[Id],
                            e.[Title],
                            e.[VideoId],
                            i.[Id],
                            i.[FileName],
                            i.[Path]
                        from [Movies] m
                        join [Episodes] e on m.[EpisodeId] = e.[Id]
                        left join [Images] i on m.[ImageId] = i.[Id]
                        where m.[Id] = @id;

                        select distinct t.[Id], t.[Name] from MovieTag mt 
                        join [Tags] t on mt.[TagId] = t.[Id]
                        where mt.[MovieId] = @id;";

            var results = await Session.Connection.QueryMultipleAsync(sql, new { id });

            var movie = results.Read<Movie, Episode, Image, Movie>((m, e, i) => {
                m.Image = i;
                m.Episode = e;
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
                var existingTag = await _tagService.GetByNameAsync(tag.Name);
                if (existingTag == null)
                {
                    existingTag = await _tagService.CreateAsync(tag);
                }

                tag.Id = existingTag.Id;

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