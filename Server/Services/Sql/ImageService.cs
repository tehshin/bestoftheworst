using System;
using System.IO;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Database;
using Dapper;
using SkiaSharp;

namespace BestOfTheWorst.Server.Services.Sql
{
    public class ImageService : BaseService, IImageService
    {
        public string ContentDirectory { get; set; }

        public ImageService(DbSession session, string contentDirectory) : base(session) { }

        public async Task CreateImage(Stream inputStream, string fileName = "", string targetDirectory = "")
        {
            var fileId = Guid.NewGuid();

            byte[] imageData = null;
            using (var ms = new MemoryStream())
            {
                await inputStream.CopyToAsync(ms);
                imageData = ms.ToArray();
            }

            string sql = @"insert into [Images] ([Id], [FileName], [Path]) values(@fileId, @fileName, @targetDirectory)";

            await Session.Connection.ExecuteAsync(sql, new { fileId, fileName, targetDirectory });

            return;
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