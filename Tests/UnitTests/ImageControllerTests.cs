using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using BestOfTheWorst.Server.Controllers;
using BestOfTheWorst.Server.Infrastructure.AutoMapper.Profiles;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.Services;
using BestOfTheWorst.Server.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace BestOfTheWorst.Tests.UnitTests
{
    public class ImageControllerTests
    {
        [Fact]
        public async Task Create_ReturnsBadRequestResult_WhenFileIsNull()
        {
            var imageServiceMock = new Mock<IImageService>();
            var controller = new ImageController(null, imageServiceMock.Object);

            var result = await controller.Create(null);

            var badRequestResult = Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsACreatedResultAndAddsImage_WhenFileIsAvailable()
        {
            string imageUrl = "/image/test.jpg";
            var urlHelperMock = new Mock<IUrlHelper>(MockBehavior.Strict);
            urlHelperMock.Setup(_ => _.Content(
                It.IsAny<string>()
            ))
            .Returns(imageUrl);

            var mapperMock = new Mock<IMapper>();
            mapperMock.Setup(m => m.Map<ImageViewModel>(It.IsAny<Image>()))
                .Returns(new ImageViewModel());

            var image = new Image { Id = Guid.NewGuid() };

            var imageServiceMock = new Mock<IImageService>();
            imageServiceMock.Setup(s => 
                s.CreateImageAsync(
                    It.IsAny<Stream>(), 
                    It.IsAny<string>(),
                    It.IsAny<string>()
                )
            ).Returns(Task.FromResult(image));

            var ms = new MemoryStream();

            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.OpenReadStream()).Returns(ms);
            fileMock.Setup(f => f.FileName).Returns("test.jpg");
            fileMock.Setup(f => f.Length).Returns(ms.Length);

            var controller = new ImageController(mapperMock.Object, imageServiceMock.Object);
            controller.Url = urlHelperMock.Object;

            var result = await controller.Create(fileMock.Object);

            var createdResult = Assert.IsType<CreatedResult>(result);
            Assert.Equal(imageUrl, createdResult.Location);
            Assert.IsType<ImageViewModel>(createdResult.Value);
        }
    }
}