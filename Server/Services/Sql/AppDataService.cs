using System.Linq;
using System.Threading.Tasks;
using BestOfTheWorst.Server.Models;
using Microsoft.AspNetCore.Identity;

namespace BestOfTheWorst.Server.Services.Sql
{
    public class AppDataService : IAppDataService
    {
        private readonly SignInManager<AppUser> _signInManager;

        public AppDataService(SignInManager<AppUser> signInManager)
        {
            _signInManager = signInManager;
        }

        public async Task<object> GetAppDataAsync()
        {
            var appData = new {
                LoginProviders = (await _signInManager.GetExternalAuthenticationSchemesAsync())
                    .ToList()
                    .Select(p => p.Name)
            };

            return appData;
        }
    }
}