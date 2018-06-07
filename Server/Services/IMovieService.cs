using System.Collections.Generic;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Models;

namespace BestOfTheWorst.Server.Services
{
    public interface IMovieService
    {
        Task<IEnumerable<Movie>> ListAllAsync();
    }
}