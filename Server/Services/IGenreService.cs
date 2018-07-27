using System.Threading.Tasks;
using BestOfTheWorst.Server.Models;

namespace BestOfTheWorst.Server.Services
{
    public interface IGenreService
    {
        Task<Genre> GetByNameAsync(string name);

        Task<Genre> CreateAsync(Genre genreToCreate);
    }
}