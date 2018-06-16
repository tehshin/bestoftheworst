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
    public class EpisodeController : Controller
    {
        private readonly IMapper _mapper;

        private readonly IEpisodeService _episodeService;

        public EpisodeController(IMapper mapper, IEpisodeService episodeService)
        {
            _mapper = mapper;
            _episodeService = episodeService;
        }

        /// <summary>
        /// Returns all Episodes.
        /// </summary>
        /// <returns>A list of Episodes.</returns>
        [HttpGet("", Name = "Episodes")]
        [ProducesResponseType(typeof(EpisodeViewModel), 200)]
        public async Task<IEnumerable<EpisodeViewModel>> GetAll()
        {
            var episodes = await _episodeService.ListAllAsync();
            return _mapper.Map<IEnumerable<EpisodeViewModel>>(episodes);
        }

        /// <summary>
        /// Returns a specific Episode.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Returns the requested Episode.</returns>
        /// <response code="200">Returns the requested episode</response>
        /// <response code="404">If the episode is null</response>
        [HttpGet("{id}", Name = "GetEpisode")]
        [ProducesResponseType(typeof(EpisodeViewModel), 201)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetById(long id)
        {
            var episode = await _episodeService.GetByIdAsync(id);
            if (episode == null)
            {
                return NotFound();
            }

            return new ObjectResult(_mapper.Map<EpisodeViewModel>(episode));
        }

        /// <summary>
        /// Creates an Episode.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /episode
        ///     {
        ///         "title": "BOTW 1",
        ///         "videoId": "3ckt5UfqgrM"
        ///     }
        ///
        /// </remarks>
        /// <param name="episode"></param>
        /// <response code="201">Returns the newly created episode</response>
        /// <response code="400">If the title or video id is null</response>
        [HttpPost("", Name = "CreateEpisode")]
        [ProducesResponseType(typeof(EpisodeViewModel), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Create([FromBody] CreateEpisodeViewModel episode)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var episodeToCreate = _mapper.Map<Episode>(episode);

            episodeToCreate = await _episodeService.CreateAsync(episodeToCreate);

            return CreatedAtAction("GetById", new { id = episodeToCreate.Id }, _mapper.Map<EpisodeViewModel>(episodeToCreate));
        }
    }
}