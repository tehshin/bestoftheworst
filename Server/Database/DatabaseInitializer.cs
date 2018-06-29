using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using OpenIddict.Abstractions;
using OpenIddict.Core;
using OpenIddict.EntityFrameworkCore.Models;

namespace BestOfTheWorst.Server.Database
{
    public class DatabaseInitializer : IDatabaseInitializer
    {
        private readonly BestOfTheWorstContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly OpenIddictApplicationManager<OpenIddictApplication> _openIddictApplicationManager;

        public DatabaseInitializer(
            BestOfTheWorstContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<AppUser> userManager,
            OpenIddictApplicationManager<OpenIddictApplication> openIddictApplicationManager
        )
        {
            _context = context;
            _roleManager = roleManager;
            _userManager = userManager;
            _openIddictApplicationManager = openIddictApplicationManager;
        }

        public async Task SeedAsync(IConfiguration config)
        {
            await CreateRolesAsync();
            await CreateUsersAsync();
            await AddOpenIdConnectOptions(config);
        }

        private async Task CreateRolesAsync()
        {
            var rolesToAdd = new List<IdentityRole>(){
                new IdentityRole { Name= "Administrator" },
                new IdentityRole { Name= "User" }
            };

            foreach (var role in rolesToAdd)
            {
                if (!_roleManager.RoleExistsAsync(role.Name).Result)
                {
                    await _roleManager.CreateAsync(role);
                }
            }
        }

        private async Task CreateUsersAsync()
        {
            if (!_context.Users.Any())
            {
                var result = await _userManager.CreateAsync(new AppUser {
                    UserName = "admin",
                    Email = "admin@botw.com",
                    CreationDate = DateTime.UtcNow,
                    IsDisabled = false,
                    EmailConfirmed = true
                }, "Stayawhileandlistentothisgrandtale1!");

                var admin = await _userManager.FindByNameAsync("admin");
                await _userManager.AddToRoleAsync(admin, "Administrator");
            }
        }

        private async Task AddOpenIdConnectOptions(IConfiguration configuration)
        {
            if (await _openIddictApplicationManager.FindByClientIdAsync("botw") == null)
            {
                var host = configuration["HostUrl"].ToString();

                var descriptor = new OpenIddictApplicationDescriptor
                {
                    ClientId = "botw",
                    DisplayName = "Best of the Worst",
                    PostLogoutRedirectUris = { new Uri($"{host}signout-oidc") },
                    RedirectUris = { new Uri(host) },
                    Permissions = 
                    {
                        OpenIddictConstants.Permissions.Endpoints.Authorization,
                        OpenIddictConstants.Permissions.Endpoints.Token,
                        OpenIddictConstants.Permissions.GrantTypes.Implicit,
                        OpenIddictConstants.Permissions.GrantTypes.Password,
                        OpenIddictConstants.Permissions.GrantTypes.RefreshToken
                    }
                };

                await _openIddictApplicationManager.CreateAsync(descriptor);
            }
        }
    }
}