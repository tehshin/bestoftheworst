using System;
using AspNet.Security.OpenIdConnect.Primitives;
using BestOfTheWorst.Server.Database;
using BestOfTheWorst.Server.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace BestOfTheWorst.Infrastructure.Extensions
{
    public class ClientSecretPair
    {
        public string ClientId { get; set; }

        public string ClientSecret { get; set; }
    }

    public class OpenIddictOptions
    {
        public IHostingEnvironment Environment { get; set; }

        public ClientSecretPair Google { get; set; } = new ClientSecretPair();

        public ClientSecretPair GitHub { get; set; } = new ClientSecretPair();

        public ClientSecretPair Twitter { get; set; } = new ClientSecretPair();

        public ClientSecretPair Microsoft { get; set; } = new ClientSecretPair();
    }

    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBestOfTheWorstIdentity(this IServiceCollection services)
        {
            services.AddIdentity<AppUser, IdentityRole>()
                .AddEntityFrameworkStores<BestOfTheWorstContext>()
                .AddDefaultTokenProviders();

            return services;
        }

        public static IServiceCollection AddCustomOpenIddict(this IServiceCollection services, Action<OpenIddictOptions> configureOptions)
        {
            var authOptions = new OpenIddictOptions();
            configureOptions.Invoke(authOptions);

            services.Configure<IdentityOptions>(options => {
                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
            });

            services.AddOpenIddict()
                .AddCore(options => {
                    options.UseEntityFrameworkCore()
                        .UseDbContext<BestOfTheWorstContext>();
                })
                .AddServer(options => {
                    options.UseMvc();
                    options.EnableTokenEndpoint("/connect/token")
                        .EnableAuthorizationEndpoint("/connect/authorize");

                    options.AllowRefreshTokenFlow()
                        .AllowImplicitFlow();
                    
                    options.SetAccessTokenLifetime(TimeSpan.FromMinutes(30));
                    options.SetIdentityTokenLifetime(TimeSpan.FromMinutes(30));
                    options.SetRefreshTokenLifetime(TimeSpan.FromMinutes(60));

                    if (authOptions.Environment.IsDevelopment())
                    {
                        options.DisableHttpsRequirement();
                    }

                    options.AddEphemeralSigningKey();
                });

            services.AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddOAuthValidation()
            .AddGoogle(o => {
                o.ClientId = authOptions.Google.ClientId;
                o.ClientSecret = authOptions.Google.ClientSecret;
            })
            .AddTwitter(o => {
                o.ConsumerKey = authOptions.Twitter.ClientId;
                o.ConsumerSecret = authOptions.Twitter.ClientSecret;
            })
            .AddGitHub(o => {
                o.ClientId = authOptions.GitHub.ClientId;
                o.ClientSecret = authOptions.GitHub.ClientSecret;
            })
            .AddMicrosoftAccount(o => {
                o.ClientId = authOptions.Microsoft.ClientId;
                o.ClientSecret = authOptions.Microsoft.ClientSecret;
            });

            return services;
        }
    }
}