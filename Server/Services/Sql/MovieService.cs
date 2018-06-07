using System.Collections.Generic;
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
    }
}