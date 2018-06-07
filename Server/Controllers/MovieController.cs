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
    public class MovieController
    {
        private readonly IMapper _mapper;
        private readonly IMovieService _movieService;

        public MovieController(IMapper mapper, IMovieService movieService)
        {
            _mapper = mapper;

            _movieService = movieService;
        }

        [HttpGet("", Name = "ListMovies")]
        [ProducesResponseType(typeof(IEnumerable<MovieViewModel>), 200)]
        public async Task<IEnumerable<MovieViewModel>> GetAll()
        {
            var movies = await _movieService.ListAllAsync();
            return _mapper.Map<IEnumerable<Movie>, IEnumerable<MovieViewModel>>(movies);
        }
    }
}