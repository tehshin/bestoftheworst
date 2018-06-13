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
            var sql = @"INSERT INTO [dbo].[Movies]
                            ([Title]
                            ,[Synopsis]
                            ,[ImageId])
                        VALUES
                            (@Title
                             ,@Synopsis
                             ,@ImageId);
                        select scope_identity();";

            // TODO: create tags if they don't exist, create MovieTag

            movieToCreate.Id = await Session.Connection.QueryFirstOrDefaultAsync<long>(sql, movieToCreate);
            return movieToCreate;
        }

        public async Task<long> UpdateAsync(Movie movieToUpdate)
        {
            var sql = @"update [Movies] 
                        set [Title] = @Title
                            ,[Synopsis] = @Synopsis
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