using System.Collections.Generic;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Database;
using BestOfTheWorst.Server.Models;
using Dapper;

namespace BestOfTheWorst.Server.Services.Sql
{
    public class TagService : BaseService, ITagService
    {
        public TagService(IDbSession session) : base(session)
        {
        }

        public async Task<Tag> CreateAsync(Tag tagToCreate)
        {
            var sql = @"INSERT INTO [Tags]
                            ([Name])
                        VALUES
                            (@Name);
                        select scope_identity();";
            
            tagToCreate.Id = await Session.Connection.QueryFirstOrDefaultAsync<long>(sql, tagToCreate);
            return tagToCreate;
        }

        public async Task<Tag> GetByNameAsync(string name)
        {
            var sql = @"select [Id], [Name] from [Tags] where [Name] = @name";
            return await Session.Connection.QueryFirstOrDefaultAsync<Tag>(sql, new { name });
        }

        public async Task<IEnumerable<Tag>> StartsWithAsync(string term, int count)
        {
            term = term + "%";
            
            var sql = @"select top (@count) [Id]
                               ,[Name] 
                        from tags 
                        where patindex(@term, [Name]) > 0
                        order by [Name]";

            return await Session.Connection.QueryAsync<Tag>(sql, new { term, count });
        }
    }
}