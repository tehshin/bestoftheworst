using System.Collections.Generic;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Models;

namespace BestOfTheWorst.Server.Services
{
    public interface IMovieService
    {
        Task<IEnumerable<Movie>> ListAllAsync();

        Task<PaginatedList<Movie>> ListAsync(int pageIndex, int pageSize);

        Task<IEnumerable<Movie>> ListByLatestEpisodesAsync(int episodeCount);

        Task<PaginatedList<Movie>> SearchAsync(string query, int pageIndex, int pageSize);

        Task<Movie> GetByIdAsync(long id);

        Task<Movie> CreateAsync(Movie movieToCreate);

        Task<long> UpdateAsync(Movie movieToUpdate);

        Task<long> DeleteAsync(long id);

        Task<IEnumerable<Movie>> ListInSameEpisodeAsync(long movieId);

        Task<IEnumerable<Movie>> ListByEpisodeAsync(long episodeId);
    }
}