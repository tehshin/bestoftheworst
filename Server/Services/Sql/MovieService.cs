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
            var sql = @"select [Id], [Title], [Synopsis] from [Movies] where [Id] = @id;
                        select distinct t.[Id], t.[Name] from MovieTag mt 
                        join [Tag] t on mt.[TagId] = t.[Id]
                        where mt.[MovieId] = @id;";

            var results = await Session.Connection.QueryMultipleAsync(sql, new { id });

            var movie = results.Read<Movie>().First();
            movie.Tags = results.Read<Tag>().ToList();

            return movie;
        }

        public async Task<Movie> CreateAsync(Movie movieToCreate)
        {
            var sql = @"INSERT INTO [dbo].[Movies]
                            ([Title]
                            ,[Synopsis])
                        VALUES
                            (@Title
                             @Synopsis);
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
    }
}