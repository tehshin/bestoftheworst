using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BestOfTheWorst.Server.Controllers;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.Services;
using BestOfTheWorst.Server.ViewModels;
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