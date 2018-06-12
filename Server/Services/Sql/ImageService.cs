using System;
using System.IO;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Database;
using BestOfTheWorst.Server.Models;
using Dapper;
using SkiaSharp;

namespace BestOfTheWorst.Server.Services.Sql
{
    public class ImageService : BaseService, IImageService
    {
        public string ContentDirectory { get; set; }

        public ImageService(IDbSession session, string contentDirectory) : base(session) { }

        public async Task<Image> CreateImage(Stream inputStream, string fileName = "", string targetDirectory = "")
        {
            var image = new Image
            {
                Id = Guid.NewGuid(),
                FileName = fileName,
                Path = targetDirectory
            };
            
            byte[] imageData = null;
            using (var ms = new MemoryStream())
            {
                await inputStream.CopyToAsync(ms);
                imageData = ms.ToArray();
            }

            StoreImageAsync(imageData, image.Id.ToString(), image.Path);

            string sql = @"insert into [Images] ([Id], [FileName], [Path]) values(@Id, @FileName, @Path)";

            await Session.Connection.ExecuteAsync(sql, image);

            return image;
        }

        private async void StoreImageAsync(byte[] imageData, string fileName, string targetDirectory = "")
        {
            string targetDir = Path.Combine(ContentDirectory, targetDirectory);

            using (var original = SKBitmap.Decode(imageData))
            using (var image = SKImage.FromBitmap(original))
            using (var fs = File.Create(Path.Combine(targetDir, $"{fileName}.jpg")))
            {
                image.Encode(SKEncodedImageFormat.Jpeg, 100).SaveTo(fs);
                await fs.FlushAsync();
            }
        }
    }
}