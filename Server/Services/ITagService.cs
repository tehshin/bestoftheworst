using System.Collections.Generic;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Models;

namespace BestOfTheWorst.Server.Services
{
    public interface ITagService
    {
        Task<IEnumerable<Tag>> StartsWithAsync(string term, int count);

        Task<Tag> GetByNameAsync(string name);

        Task<Tag> CreateAsync(Tag tagToCreate);
    }
}