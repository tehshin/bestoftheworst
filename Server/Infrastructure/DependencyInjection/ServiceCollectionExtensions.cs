using BestOfTheWorst.Server.Database;
using BestOfTheWorst.Server.Services;
using BestOfTheWorst.Server.Services.Sql;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace BestOfTheWorst.Server.Infrastructure.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBestOfTheWorstServices(this IServiceCollection services, string connectionString)
        {
            services.AddScoped<IDbSession>(c => new DbSession(connectionString));
            services.AddScoped<IMovieService, MovieService>();
            services.AddScoped<IImageService>(c => 
                new ImageService(
                    c.GetService<IDbSession>(), 
                    c.GetService<IHostingEnvironment>().WebRootPath));

            return services;
        }
    }
}