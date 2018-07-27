using System;
using System.IO;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Models;

namespace BestOfTheWorst.Server.Services
{
    public interface IImageService
    {
        Task<Image> DownloadMovieDbImageAsync(string image, string targetDirectory = "");

        Task<Image> CreateImageAsync(Stream inputStream, string fileName = "", string targetDirectory = "");
    }
}