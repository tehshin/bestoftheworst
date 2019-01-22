using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Database;
using BestOfTheWorst.Server.Models;
using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using SkiaSharp;

namespace BestOfTheWorst.Server.Services.Sql
{
    public class ImageService : BaseService, IImageService
    {
        private readonly AppSettings _appSettings;

        private int[] _widths = new[] { 500, 250, 100 };
        private double _sizeRatio = 1.5;

        public string ContentDirectory { get; set; }

        public ImageService(IDbSession session, IOptions<AppSettings> appSettings, string contentDirectory) : base(session) 
        { 
            ContentDirectory = contentDirectory;
            _appSettings = appSettings.Value;
        }

        public async Task<Image> DownloadMovieDbImageAsync(string image, string targetDirectory = "")
        {
            var imageUrl = $"{_appSettings.MovieDb.ImageBaseUrl}{image}";

            using (var client = new HttpClient())
            using (var stream = await client.GetStreamAsync(imageUrl))
            {
                var localImage = await CreateImageAsync(stream, image, targetDirectory);
                return localImage;
            }
        }

        public async Task<Image> CreateImageAsync(Stream inputStream, string fileName = "", string targetDirectory = "")
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

            await StoreImageAsync(imageData, image.Id.ToString(), image.Path);
            foreach (var width in _widths)
            {
                await StoreImageAsync(imageData, image.Id.ToString(), image.Path, width, (int)Math.Round(width * _sizeRatio));
            }

            string sql = @"insert into [Images] ([Id], [FileName], [Path]) values(@Id, @FileName, @Path)";

            await Session.Connection.ExecuteAsync(sql, image);

            return image;
        }

        private async Task StoreImageAsync(byte[] imageData, string fileName, string targetDirectory = "", int? width = null, int? height = null)
        {
            string targetDir = Path.Combine(ContentDirectory, targetDirectory);

            if (!Directory.Exists(targetDir))
            {
                Directory.CreateDirectory(targetDir);
            }

            if (width.HasValue && height.HasValue)
            {
                fileName = $"{fileName}_{width.Value}";

                using (var resized = CropAndResize(imageData, width.Value, height.Value))
                {
                    if (resized == null) return;

                    using (var image = SKImage.FromBitmap(resized))
                    using (var fs = File.Create(Path.Combine(targetDir, $"{fileName}.jpg")))
                    {
                        image.Encode(SKEncodedImageFormat.Jpeg, 100).SaveTo(fs);
                        await fs.FlushAsync();
                    }
                }
            }
            else
            {
                using (var original = SKBitmap.Decode(imageData))
                using (var image = SKImage.FromBitmap(original))
                using (var fs = File.Create(Path.Combine(targetDir, $"{fileName}.jpg")))
                {
                    image.Encode(SKEncodedImageFormat.Jpeg, 100).SaveTo(fs);
                    await fs.FlushAsync();
                }
            }
        }

        private SKBitmap CropAndResize(byte[] imageData, int width, int height)
        {
            using (var original = SKBitmap.Decode(imageData))
            {
                int cropSides = 0, cropTopBottom = 0;

                if ((float)width / original.Width < (float)height / original.Height)
                {
                    cropSides = original.Width - (int)Math.Round((float)original.Height / height * width);
                }
                else
                {
                    cropTopBottom = original.Height - (int)Math.Round((float)original.Width / width * height);
                }

                var cropRect = new SKRectI
                {
                    Left = cropSides / 2,
                    Top = cropTopBottom / 2,
                    Right = original.Width - cropSides + cropSides / 2,
                    Bottom = original.Height - cropTopBottom + cropTopBottom / 2
                };

                using (var cropped = new SKBitmap(cropRect.Width, cropRect.Height))
                {
                    original.ExtractSubset(cropped, cropRect);
                    return cropped.Resize(new SKImageInfo(width, height), SKFilterQuality.High);
                }
            }
        }
    }
}