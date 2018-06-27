using System.Threading.Tasks;
using BestOfTheWorst.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BestOfTheWorst.Server.Controllers
{
    public class AuthorizationController : Controller
    {
        private readonly IOptions<IdentityOptions> _identityOptions;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;

        public AuthorizationController(
            IOptions<IdentityOptions> identityOptions,
            SignInManager<AppUser> signInManager,
            UserManager<AppUser> userManager
        )
        {
            _identityOptions = identityOptions;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [AllowAnonymous]
        [HttpGet("~/connect/authorize")]
        public async Task<IActionResult> Authorize()
        {
            var loginInfo = await _signInManager.GetExternalLoginInfoAsync();
            return LocalRedirect("~/?loginstatus=1");
        }
    }
}