using System.Collections.Generic;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Database;
using BestOfTheWorst.Server.Models;
using Dapper;

namespace BestOfTheWorst.Server.Services.Sql
{
    public class EpisodeService : BaseService, IEpisodeService
    {
        public EpisodeService(IDbSession session) : base(session)
        {
        }

        public async Task<Episode> CreateAsync(Episode episodeToCreate)
        {
            var sql = @"INSERT INTO [Episodes]
                            ([Title]
                            ,[VideoId]
                            ,[ReleaseDate])
                        VALUES
                            (@Title
                            ,@VideoId
                            ,@ReleaseDate);
                        select scope_identity()";
            
            episodeToCreate.Id = await Session.Connection.QueryFirstOrDefaultAsync<long>(sql, episodeToCreate);

            return episodeToCreate;
        }

        public async Task DeleteAsync(long id)
        {
            var sql = "delete from [Episodes] where [Id] = @id";
            await Session.Connection.ExecuteAsync(sql, new { id });
        }

        public async Task<Episode> GetByIdAsync(long id)
        {
            var sql = "select [Id], [Title], [VideoId], [ReleaseDate] from [Episodes] where [Id] = @id";
            return await Session.Connection.QueryFirstOrDefaultAsync<Episode>(sql, new { id });
        }

        public async Task<IEnumerable<Episode>> ListAllAsync()
        {
            var sql = "select [Id], [Title], [VideoId], [ReleaseDate] from [Episodes]";
            return await Session.Connection.QueryAsync<Episode>(sql);
        }

        public async Task UpdateAsync(Episode episodeToUpdate)
        {
            var sql = @"UPDATE [dbo].[Episodes]
                        SET [Title] = @Title
                            ,[VideoId] = @VideoId
                            ,[ReleaseDate] = @ReleaseDate
                        WHERE
                            [Id] = @Id";
            
            await Session.Connection.ExecuteAsync(sql, episodeToUpdate);
        }
    }
}