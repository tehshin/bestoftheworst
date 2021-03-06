using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BestOfTheWorst.Server.Controllers;
using BestOfTheWorst.Server.Infrastructure.AutoMapper.Profiles;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.Services;
using BestOfTheWorst.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Moq;
using Xunit;

namespace BestOfTheWorst.Tests.UnitTests
{
    public class MovieControllerTests
    {
        [Fact]
        public async Task Get_ReturnsAMovieListVieWModel()
        {
            var mapper = CreateAutomapper();

            Mock<IMovieService> movieServiceMock = new Mock<IMovieService>();
            movieServiceMock.Setup(s => s.ListAsync(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.FromResult(GetTestMovies()));
            
            var controller = new MovieController(mapper, movieServiceMock.Object);

            var result = await controller.Get(1, 3);

            Assert.IsType<MovieListViewModel>(result);
            Assert.Equal(3, result.Items.Count());

            Assert.Equal(2, result.Paging.TotalPages);
            Assert.Equal(1, result.Paging.PageIndex);
            Assert.Equal(3, result.Paging.PageSize);
            Assert.Equal(6, result.Paging.TotalItems);
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

            var objectResult = Assert.IsType<OkObjectResult>(result);
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

        [Fact]
        public async Task Create_ReturnsACreatedAtActionResultAndAddsMovie_WhenModelStateIsValid()
        {
            var mapper = CreateAutomapper();

            var movieServiceMock = new Mock<IMovieService>();
            movieServiceMock.Setup(s => s.CreateAsync(It.IsAny<Movie>()))
                .Returns(Task.FromResult(new Movie() { Id = 1 }))
                .Verifiable();

            var controller = new MovieController(mapper, movieServiceMock.Object);
            var movie = new MovieFormViewModel
            {
                Title = "New movie",
                Synopsis = "It's about people",
                Tags = new List<string>() { "Tag 1", "Tag 2" }
            };

            var result = await controller.Create(movie);

            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);

            Assert.Null(createdAtActionResult.ControllerName);
            Assert.Equal("GetById", createdAtActionResult.ActionName);
            Assert.IsType<MovieDetailViewModel>(createdAtActionResult.Value);
            movieServiceMock.Verify();
        }

        [Fact]
        public async Task Update_ReturnsNotFound_WhenMovieIsNull()
        {
            var mapper = CreateAutomapper();

            var movieServiceMock = new Mock<IMovieService>();
            movieServiceMock.Setup(s => s.GetByIdAsync(It.IsAny<long>())).Returns(Task.FromResult((Movie)null));

            var controller = new MovieController(mapper, movieServiceMock.Object);

            var movie = new MovieFormViewModel();

            var result = await controller.Update(123, movie);

            var notFoundResult = Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Update_ReturnsNoContentResultAndUpdatesMovie_WhenModelStateIsValid()
        {
            var mapper = CreateAutomapper();

            var movieServiceMock = new Mock<IMovieService>();
            movieServiceMock.Setup(s => s.GetByIdAsync(It.IsAny<long>()))
                .Returns(Task.FromResult(new Movie()))
                .Verifiable();
            movieServiceMock.Setup(s => s.UpdateAsync(It.IsAny<Movie>()))
                .Returns(Task.FromResult((long)1))
                .Verifiable();

            var controller = new MovieController(mapper, movieServiceMock.Object);
            
            var movie = new MovieFormViewModel();
            var result = await controller.Update(1, movie);

            var noContentResult = Assert.IsType<NoContentResult>(result);
            movieServiceMock.Verify();
        }

        [Fact]
        public async Task Delete_ReturnsNoContentResult_WhenMovieIsNull()
        {
            var mapper = CreateAutomapper();
            var movieServiceMock = new Mock<IMovieService>();
            movieServiceMock.Setup(s => s.GetByIdAsync(It.IsAny<long>())).Returns(Task.FromResult((Movie)null));

            var controller = new MovieController(mapper, movieServiceMock.Object);

            var result = await controller.Delete(1);

            var noContentResult = Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Delete_ReturnsNoContentResultAndDeletesMovie()
        {
            var mapper = CreateAutomapper();
            var movieServiceMock = new Mock<IMovieService>();
            movieServiceMock.Setup(s => s.GetByIdAsync(It.IsAny<long>()))
                .Returns(Task.FromResult(new Movie()))
                .Verifiable();
            movieServiceMock.Setup(s => s.DeleteAsync(It.IsAny<long>()))
                .Returns(Task.FromResult((long)1))
                .Verifiable();

            var controller = new MovieController(mapper, movieServiceMock.Object);

            var result = await controller.Delete(1);

            var noContentResult = Assert.IsType<NoContentResult>(result);
            movieServiceMock.Verify();
        }

        private IMapper CreateAutomapper()
        {
            var mapperConfig = new MapperConfiguration(config => {
                config.AddProfile(new MovieProfile());
            });
            return mapperConfig.CreateMapper();
        }

        private PaginatedList<Movie> GetTestMovies()
        {
            var movies = new List<Movie>()
            {
                new Movie { Id = 1, Title = "Movie 1" },
                new Movie { Id = 2, Title = "Movie 2" },
                new Movie { Id = 3, Title = "Movie 3" },
                new Movie { Id = 4, Title = "Movie 4" },
                new Movie { Id = 5, Title = "Movie 5" },
                new Movie { Id = 6, Title = "Movie 6" }
            };

            return new PaginatedList<Movie>(movies.Take(3).ToList(), movies.Count, 1, 3);
        }
    }
}