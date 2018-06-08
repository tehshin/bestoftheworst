using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BestOfTheWorst.Server.Controllers;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.Services;
using BestOfTheWorst.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace BestOfTheWorst.Tests.UnitTests
{
    public class MovieControllerTests
    {
        [Fact]
        public async Task GetAll_ReturnsAListOfMovieViewModels()
        {
            var mapper = CreateAutomapper();

            Mock<IMovieService> movieServiceMock = new Mock<IMovieService>();
            movieServiceMock.Setup(s => s.ListAllAsync()).Returns(Task.FromResult(GetTestMovies()));
            
            var controller = new MovieController(mapper, movieServiceMock.Object);

            var result = await controller.GetAll();

            Assert.IsType<List<MovieViewModel>>(result);
            Assert.Equal(3, result.Count());
        }

        [Fact]
        public async Task GetById_ReturnsAObjectResult_WithAMovieDetailViewModel()
        {
            var mapper = CreateAutomapper();

            var movie = new Movie
            {
                Id = 2,
                Title = "Movie title",
                Synopsis = "Short description for the movie",
                Tags = new List<Tag> 
                {
                    new Tag { Id = 1, Name = "Tag 1" },
                    new Tag { Id = 2, Name = "Tag 2" }
                }
            };

            Mock<IMovieService> movieServiceMock = new Mock<IMovieService>();
            movieServiceMock.Setup(s => s.GetByIdAsync(It.IsAny<long>())).Returns(Task.FromResult(movie));

            var controller = new MovieController(mapper, movieServiceMock.Object);

            var result = await controller.GetById(2);

            var objectResult = Assert.IsType<ObjectResult>(result);
            var model = Assert.IsAssignableFrom<MovieDetailViewModel>(objectResult.Value);
            Assert.Equal(2, model.Id);
            Assert.Equal(2, model.Tags.Count);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenMovieIsNull()
        {
            var mapper = CreateAutomapper();

            Mock<IMovieService> movieServiceMock = new Mock<IMovieService>();
            movieServiceMock.Setup(s => s.GetByIdAsync(It.IsAny<long>())).Returns(Task.FromResult((Movie)null));

            var controller = new MovieController(mapper, movieServiceMock.Object);

            var result = await controller.GetById(2);

            var notFoundResult = Assert.IsType<NotFoundResult>(result);
        }

        private IMapper CreateAutomapper()
        {
            var mapperConfig = new MapperConfiguration(config => {
                
            });
            return mapperConfig.CreateMapper();
        }

        private IEnumerable<Movie> GetTestMovies()
        {
            return new List<Movie>()
            {
                new Movie { Id = 1, Title = "Movie 1" },
                new Movie { Id = 2, Title = "Movie 2" },
                new Movie { Id = 3, Title = "Movie 3" }
            };
        }
    }
}