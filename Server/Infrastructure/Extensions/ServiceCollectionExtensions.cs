using BestOfTheWorst.Server.Database;
using BestOfTheWorst.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace BestOfTheWorst.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBestOfTheWorstIdentity(this IServiceCollection services)
        {
            services.AddIdentity<AppUser, IdentityRole>()
                .AddEntityFrameworkStores<BestOfTheWorstContext>()
                .AddDefaultTokenProviders();

            return services;
        }
    }
}