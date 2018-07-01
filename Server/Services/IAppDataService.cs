using System.Threading.Tasks;

namespace BestOfTheWorst.Server.Services
{
    public interface IAppDataService
    {
        Task<object> GetAppDataAsync();
    }
}