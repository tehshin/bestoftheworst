using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace BestOfTheWorst.Server.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class TagController : Controller
    {
        private readonly ITagService _tagService;

        public TagController(ITagService tagService)
        {
            _tagService = tagService;
        }

        /// <summary>
        /// Returns a list of Tags starting with a given string.
        /// </summary>
        /// <returns>A paged list of Movies.</returns>
        [HttpGet("autocomplete", Name = "TagAutocomplete")]
        [ProducesResponseType(typeof(IEnumerable<string>), 200)]
        public async Task<IEnumerable<string>> Autocomplete(string term)
        {
            if (string.IsNullOrEmpty(term))
                return new List<string>();

            var tags = await _tagService.StartsWithAsync(term, 10);
            return tags.Select(t => t.Name).ToList();
        }
    }
}