using System.Threading.Tasks;
using BestOfTheWorst.Server.Database;
using BestOfTheWorst.Server.Models;
using Dapper;

namespace BestOfTheWorst.Server.Services.Sql
{
    public class GenreService : BaseService, IGenreService
    {
        public GenreService(IDbSession session) : base(session)
        {
            
        }

        public async Task<Genre> CreateAsync(Genre genreToCreate)
        {
            var sql = @"INSERT INTO [Genre] ([Name]) VALUES (@Name);
                       select scope_identity();";
            
            genreToCreate.Id = await Session.Connection.QueryFirstOrDefaultAsync<long>(sql, genreToCreate);
            return genreToCreate;
        }

        public async Task<Genre> GetByNameAsync(string name)
        {
            var sql = "SELECT [Id], [Name] FROM [Genre] where [Name] = @name";
            return await Session.Connection.QueryFirstOrDefaultAsync<Genre>(sql, new { name });
        }
    }
}