using System;
using System.IO;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Models;

namespace BestOfTheWorst.Server.Services
{
    public interface IImageService
    {
        Task<Image> CreateImage(Stream inputStream, string fileName = "", string targetDirectory = "");
    }
}