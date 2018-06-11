using System.IO;
using System.Threading.Tasks;

namespace BestOfTheWorst.Server.Services
{
    public interface IImageService
    {
        Task CreateImage(Stream inputStream, string fileName = "", string targetDirectory = "");
    }
}