using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace BestOfTheWorst.Server.Database
{
    public interface IDatabaseInitializer
    {
        Task SeedAsync(IConfiguration config);
    }
}