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
        /// Returns a page of Movies.
        /// </summary>
        /// <returns>A paged list of Movies.</returns>
        [HttpGet("", Name = "ListMovies")]
        [ProducesResponseType(typeof(MovieListViewModel), 200)]
        public async Task<MovieListViewModel> Get([FromQuery]int page, [FromQuery]int pageSize)
        {
            if (page <= 0)
            {
                page = 1;
            }

            if (pageSize <= 0)
            {
                pageSize = 10;
            }

            var pageOfMovies = await _movieService.ListAsync(page, pageSize);
            var movieListViewModel = _mapper.Map<PaginatedList<Movie>, MovieListViewModel>(pageOfMovies);

            return movieListViewModel;
        }

        /// <summary>
        /// Returns a specific Movie.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Returns the requested Movie.</returns>
        /// <response code="200">Returns the requested movie</response>
        /// <response code="404">If the movie is null</response>
        [HttpGet("{id}", Name = "GetMovie")]
        [ProducesResponseType(typeof(MovieDetailViewModel), 201)]
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

        /// <summary>
        /// Creates a Movie.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /movie
        ///     {
        ///         "title": "New movie name",
        ///         "synopsis": "Movie synopsis",
        ///         "tags": ["tag 1", "tag 2"]
        ///     }
        ///
        /// </remarks>
        /// <param name="movie"></param>
        /// <returns>A newly created Movie</returns>
        /// <response code="201">Returns the newly created movie</response>
        /// <response code="400">If the title is null</response>
        [HttpPost("", Name = "CreateMovie")]
        [ProducesResponseType(typeof(MovieDetailViewModel), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Create([FromBody] CreateMovieViewModel movie)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var movieToCreate = _mapper.Map<Movie>(movie);
            
            movieToCreate = await _movieService.CreateAsync(movieToCreate);

            return CreatedAtAction("GetById", new { id = movieToCreate.Id }, _mapper.Map<MovieDetailViewModel>(movieToCreate));
        }

        /// <summary>
        /// Updates a Movie.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     PUT /movie
        ///     {
        ///         "title": "Movie name",
        ///         "synopsis": "Movie synopsis"
        ///     }
        ///
        /// </remarks>
        /// <param name="id"></param>
        /// <param name="movie"></param>
        /// <response code="400">If the title is null</response>
        /// <response code="404">If the movie is null</response>
        [HttpPut("{id}", Name = "UpdateMovie")]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateMovieViewModel movie)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var movieToUpdate = await _movieService.GetByIdAsync(id);
            if (movieToUpdate == null)
            {
                return NotFound();
            }

            _mapper.Map(movie, movieToUpdate);
            await _movieService.UpdateAsync(movieToUpdate);

            return NoContent();
        }

        /// <summary>
        /// Deletes a specific Movie.
        /// </summary>
        /// <param name="id"></param>
        [HttpDelete("{id}", Name = "DeleteMovie")]
        public async Task<IActionResult> Delete(long id)
        {
            var movie = await _movieService.GetByIdAsync(id);

            if (movie == null)
            {
                return NoContent();
            }

            await _movieService.DeleteAsync(id);
            return NoContent();
        }
    }
}