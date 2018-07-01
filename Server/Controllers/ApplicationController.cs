using System.Threading.Tasks;
using BestOfTheWorst.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace BestOfTheWorst.Server.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationController : ControllerBase
    {
        private readonly IAppDataService _appDataService;

        public ApplicationController(IAppDataService appDataService)
        {
            _appDataService = appDataService;
        }

        [HttpGet("data", Name = "GetAppData")]
        public async Task<IActionResult> Get()
        {
            var appData = await _appDataService.GetAppDataAsync();
            return Ok(appData);
        }
    }
}