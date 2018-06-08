using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.Services;
using BestOfTheWorst.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace BestOfTheWorst.Server.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class MovieController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IMovieService _movieService;

        public MovieController(IMapper mapper, IMovieService movieService)
        {
            _mapper = mapper;

            _movieService = movieService;
        }

        /// <summary>
        /// Returns all Movies.
        /// </summary>
        /// <returns>A list of Movies.</returns>
        [HttpGet("", Name = "ListMovies")]
        [ProducesResponseType(typeof(IEnumerable<MovieViewModel>), 200)]
        public async Task<IEnumerable<MovieViewModel>> GetAll()
        {
            var movies = await _movieService.ListAllAsync();
            return _mapper.Map<IEnumerable<Movie>, IEnumerable<MovieViewModel>>(movies);
        }

        /// <summary>
        /// Returns a specific Movie.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Returns the requested Movie.</returns>
        /// <response code="200">Returns the requested movie</response>
        /// <response code="404">If the movie is null</response>
        [HttpGet("{id}", Name = "GetStory")]
        [ProducesResponseType(typeof(MovieViewModel), 201)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetById(long id)
        {
            var movie = await _movieService.GetByIdAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            return new ObjectResult(_mapper.Map<MovieDetailViewModel>(movie));
        }
    }
}