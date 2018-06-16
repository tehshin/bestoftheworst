using System.Collections.Generic;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Models;

namespace BestOfTheWorst.Server.Services
{
    public interface IEpisodeService
    {
        Task<IEnumerable<Episode>> ListAllAsync();

        Task<Episode> GetByIdAsync(long id);

        Task<Episode> CreateAsync(Episode episodeToCreate);

        Task UpdateAsync(Episode episodeToUpdate);

        Task DeleteAsync(long id);
    }
}