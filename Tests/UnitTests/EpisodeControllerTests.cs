using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using BestOfTheWorst.Server.Controllers;
using BestOfTheWorst.Server.Infrastructure.AutoMapper.Profiles;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.Services;
using BestOfTheWorst.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace BestOfTheWorst.Tests.UnitTests
{
    public class EpisodeControllerTests
    {
        [Fact]
        public async Task GetAll_ReturnsAnIEnumerableOfEpisodeViewModels()
        {
            var mapper = CreateAutoMapper();

            var episodeServiceMock = new Mock<IEpisodeService>();
            episodeServiceMock.Setup(s => s.ListAllAsync())
                .Returns(Task.FromResult(GetTestEpisodes()));

            var controller = new EpisodeController(mapper, episodeServiceMock.Object);

            var result = await controller.GetAll();

            Assert.IsType<List<EpisodeViewModel>>(result);
        }

        [Fact]
        public async Task GetById_ReturnsAObjectResult_WithAEpisodeViewModel()
        {
            var mapper = CreateAutoMapper();

            var episode = new Episode
            {
                Id = 1,
                Title = "Best of the Worst #1",
                VideoId = "adfjl"
            };

            var episodeServiceMock = new Mock<IEpisodeService>();
            episodeServiceMock.Setup(s => s.GetByIdAsync(It.IsAny<long>()))
                .Returns(Task.FromResult(episode));

            var controller = new EpisodeController(mapper, episodeServiceMock.Object);

            var result = await controller.GetById(1);

            var objectResult = Assert.IsType<ObjectResult>(result);
            var model = Assert.IsAssignableFrom<EpisodeViewModel>(objectResult.Value);
            Assert.Equal(1, model.Id);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenEpisodeIsNull()
        {
            var mapper = CreateAutoMapper();

            var episodeServiceMock = new Mock<IEpisodeService>();
            episodeServiceMock.Setup(s => s.GetByIdAsync(It.IsAny<long>()))
                .Returns(Task.FromResult((Episode)null));

            var controller = new EpisodeController(mapper, episodeServiceMock.Object);

            var result = await controller.GetById(23);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Create_ReturnsBadRequestResult_WhenModelStateIsInvalid()
        {
            var mapper = CreateAutoMapper();

            var episodeServiceMock = new Mock<IEpisodeService>();
            episodeServiceMock.Setup(s => s.CreateAsync(It.IsAny<Episode>()))
                .Returns(Task.FromResult(new Episode()));

            var controller = new EpisodeController(mapper, episodeServiceMock.Object);
            controller.ModelState.AddModelError("Title", "A title is required");

            var newEpisode = new CreateEpisodeViewModel();

            var result = await controller.Create(newEpisode);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.IsType<SerializableError>(badRequestResult.Value);
        }

        [Fact]
        public async Task Create_ReturnsACreatedAtActionResultAndAddsEpisode_WhenModelStateIsValid()
        {
            var mapper = CreateAutoMapper();

            var episodeServiceMock = new Mock<IEpisodeService>();
            episodeServiceMock.Setup(s => s.CreateAsync(It.IsAny<Episode>()))
                .Returns(Task.FromResult(new Episode()))
                .Verifiable();

            var controller = new EpisodeController(mapper, episodeServiceMock.Object);
            var episode = new CreateEpisodeViewModel
            {
                Title = "Episode 1",
                VideoId = "aljklasf"
            };

            var result = await controller.Create(episode);

            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal("GetById", createdAtActionResult.ActionName);
            Assert.IsType<EpisodeViewModel>(createdAtActionResult.Value);
            episodeServiceMock.Verify();
        }

        private IMapper CreateAutoMapper()
        {
            var mapperConfig = new MapperConfiguration(config => {
                config.AddProfile(new EpisodeProfile());
            });
            return mapperConfig.CreateMapper();
        }

        private IEnumerable<Episode> GetTestEpisodes()
        {
            return new List<Episode>
            {
                new Episode { Id = 1, Title = "Episode 1", VideoId = "abcd" },
                new Episode { Id = 2, Title = "Episode 2", VideoId = "abcd" },
                new Episode { Id = 3, Title = "Episode 3", VideoId = "abcd" }
            };
        }
    }
}