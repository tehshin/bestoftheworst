using System.Collections.Generic;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Models;

namespace BestOfTheWorst.Server.Services
{
    public interface IMovieService
    {
        Task<IEnumerable<Movie>> ListAllAsync();

        Task<Movie> GetByIdAsync(long id);

        Task<Movie> CreateAsync(Movie movieToCreate);

        Task<long> UpdateAsync(Movie movieToUpdate);
    }
}