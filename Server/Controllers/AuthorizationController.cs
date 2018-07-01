using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;
using AspNet.Security.OpenIdConnect.Server;
using BestOfTheWorst.Server.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OpenIddict.Abstractions;

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

        private IActionResult CreateChallenge(string provider)
        {
            var returnUrl = Request.PathBase + Request.Path + Request.QueryString;
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, returnUrl);
            return Challenge(properties, provider);
        }

        [AllowAnonymous]
        [HttpGet("~/connect/authorize")]
        public async Task<IActionResult> Authorize(OpenIdConnectRequest request)
        {
            var loginInfo = await _signInManager.GetExternalLoginInfoAsync();

            if (loginInfo == null)
            {
                var provider = (string)request["provider"];

                if (!string.IsNullOrEmpty(provider))
                {
                    return CreateChallenge(provider);
                }
            }

            var result = await _signInManager.ExternalLoginSignInAsync(loginInfo.LoginProvider, 
                loginInfo.ProviderKey, isPersistent: false);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByLoginAsync(loginInfo.LoginProvider, loginInfo.ProviderKey);

                if (user == null)
                {
                    return LocalRedirect("/?loginstatus=1");
                }

                var ticket = await CreateTicketAsync(request, user);
                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            else
            {
                var email = (string)request["email"];
                var username = (string)request["username"];

                if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(username))
                {
                    var user = new AppUser { 
                        Email = email, 
                        UserName = username, 
                        CreationDate = DateTime.UtcNow 
                    };

                    var createUserResult = await _userManager.CreateAsync(user);

                    if (createUserResult.Succeeded)
                    {
                        createUserResult = await _userManager.AddLoginAsync(user, loginInfo);
                        if (createUserResult.Succeeded)
                        {
                            var ticket = await CreateTicketAsync(request, user);
                            return SignIn(ticket.Principal, ticket.Properties,
                                ticket.AuthenticationScheme);
                        }
                    }
                    else
                    {
                        return BadRequest(new { message = "Email already exists" });
                    }
                }
                else
                {
                    return LocalRedirect("/?loginstatus=2");
                }
            }

            return LocalRedirect("/?loginstatus=1");
        }

        private async Task<AuthenticationTicket> CreateTicketAsync(OpenIdConnectRequest request,
            AppUser user, AuthenticationProperties properties = null)
        {
            var principal = await _signInManager.CreateUserPrincipalAsync(user);

            var ticket = new AuthenticationTicket(principal, properties,
                OpenIdConnectServerDefaults.AuthenticationScheme);

            if (!request.IsRefreshTokenGrantType())
            {
                ticket.SetScopes(new [] {
                    OpenIdConnectConstants.Scopes.OpenId,
                    OpenIdConnectConstants.Scopes.Email,
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIdConnectConstants.Scopes.OfflineAccess,
                    OpenIddictConstants.Scopes.Roles
                });
            }

            ticket.SetResources("resource_server");

            foreach (var claim in ticket.Principal.Claims)
            {
                if (claim.Type == _identityOptions.Value.ClaimsIdentity.SecurityStampClaimType)
                {
                    continue;
                }

                var destinations = new List<string>
                {
                    OpenIdConnectConstants.Destinations.AccessToken
                };

                // Only add the iterated claim to the id_token if the corresponding scope was granted to the client application.
                // The other claims will only be added to the access_token, which is encrypted when using the default format.
                if ((claim.Type == OpenIdConnectConstants.Claims.Name && ticket.HasScope(OpenIdConnectConstants.Scopes.Profile)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Email && ticket.HasScope(OpenIdConnectConstants.Scopes.Email)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Role && ticket.HasScope(OpenIddictConstants.Claims.Roles)))
                {
                    destinations.Add(OpenIdConnectConstants.Destinations.IdentityToken);
                }

                claim.SetDestinations(destinations);
            }

            return ticket;
        }
    }
}