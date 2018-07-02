using System;
using System.Threading.Tasks;
using AutoMapper;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BestOfTheWorst.Server.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;

        public UserController(
            UserManager<AppUser> userManager,
            IMapper mapper
        )
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        /// <summary>
        /// Check the availability of a username.
        /// </summary>
        /// <param name="username"></param>
        /// <returns>Returns true if username is available.</returns>
        /// <response code="200">Returns the validation result</response>
        [HttpGet("validate/username", Name = "ValidateUsername")]
        [AllowAnonymous]
        public async Task<IActionResult> ValidateUsername([FromQuery]string username)
        {
            var user = await _userManager.FindByNameAsync(username);

            return Ok(new {
                IsAvailable = user == null
            });
        }

        /// <summary>
        /// Get user info for the current user.
        /// </summary>
        /// <returns>Returns user info summary.</returns>
        /// <response code="200">Returns the user info</response>
        /// <response code="401">If user is not logged in</response>
        [HttpGet("info", Name = "GetUserInfo")]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UserInfo()
        {
            var user = await _userManager.GetUserAsync(this.User);
            if (user == null)
                throw new UnauthorizedAccessException();

            var infoViewModel = _mapper.Map<UserInfoViewModel>(user);
            return Ok(infoViewModel);
        }
    }
}