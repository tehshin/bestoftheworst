using BestOfTheWorst.Server.Database;
using BestOfTheWorst.Server.Infrastructure.Security;
using BestOfTheWorst.Server.Models;
using BestOfTheWorst.Server.Services;
using BestOfTheWorst.Server.Services.Sql;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace BestOfTheWorst.Server.Infrastructure.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBestOfTheWorstServices(this IServiceCollection services, string connectionString)
        {
            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
            services.AddScoped<IUrlHelper>(_ => {
                var actionContext = _.GetRequiredService<IActionContextAccessor>().ActionContext;
                var factory = _.GetRequiredService<IUrlHelperFactory>();
                return factory.GetUrlHelper(actionContext);
            });

            services.AddScoped<IUserClaimsPrincipalFactory<AppUser>, CustomClaimsPrincipalFactory>();

            services.AddScoped<IDbSession>(c => new DbSession(connectionString));
            services.AddScoped<ITagService, TagService>();
            services.AddScoped<IGenreService, GenreService>();
            services.AddScoped<IMovieService, MovieService>();
            services.AddScoped<IEpisodeService, EpisodeService>();
            services.AddScoped<IAppDataService, AppDataService>();
            services.AddScoped<IImageService>(c => 
                new ImageService(
                    c.GetService<IDbSession>(),
                    c.GetService<IOptions<AppSettings>>(),
                    c.GetService<IHostingEnvironment>().WebRootPath));

            services.AddTransient<IDatabaseInitializer, DatabaseInitializer>();

            return services;
        }
    }
}