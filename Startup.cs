using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using AutoMapper;
using BestOfTheWorst.Infrastructure.Extensions;
using BestOfTheWorst.Infrastructure.Swagger.Filter;
using BestOfTheWorst.Server.Database;
using BestOfTheWorst.Server.Infrastructure.DependencyInjection;
using BestOfTheWorst.Server.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Swagger;

namespace BestOfTheWorst
{
    public class Startup
    {
        private readonly IHostingEnvironment _env;

        public static IConfiguration Configuration { get; set; }
        
        public Startup(IHostingEnvironment env)
        {
            _env = env;

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<AppSettings>(Configuration);

            string connectionString = Configuration.GetConnectionString("Database");

            services.AddLogging(builder => {
                builder.AddConfiguration(Configuration.GetSection("Logging"))
                    .AddConsole()
                    .AddDebug();
            });

            services.AddDbContextPool<BestOfTheWorstContext>(opt => {
                opt.UseSqlServer(connectionString: connectionString);
                opt.UseOpenIddict();
            });

            services.AddBestOfTheWorstIdentity();

            services.AddBestOfTheWorstServices(connectionString);

            services.AddCustomOpenIddict(options => {
                options.Environment = _env;

                options.Google.ClientId = Configuration["Authentication:Google:ClientId"];
                options.Google.ClientSecret = Configuration["Authentication:Google:ClientSecret"];

                options.Twitter.ClientId = Configuration["Authentication:Twitter:ClientId"];
                options.Twitter.ClientSecret = Configuration["Authentication:Twitter:ClientSecret"];

                options.GitHub.ClientId = Configuration["Authentication:GitHub:ClientId"];
                options.GitHub.ClientSecret = Configuration["Authentication:GitHub:ClientSecret"];

                options.Microsoft.ClientId = Configuration["Authentication:Microsoft:ClientId"];
                options.Microsoft.ClientSecret = Configuration["Authentication:Microsoft:ClientSecret"];
            });

            services.AddAutoMapper();

            services.Configure<RouteOptions>(options => options.LowercaseUrls = true);
            
            services.AddMvc();

            services.AddSwaggerGen(c => {
                c.CustomSchemaIds(x => x.FullName);

                c.SwaggerDoc("v1", new Info {
                    Title = "Best of the Worst API",
                    Version = "v1"
                });

                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetEntryAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

                if (File.Exists(xmlPath))
                    c.IncludeXmlComments(xmlPath);

                c.DocumentFilter<LowercaseDocumentFilter>();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles();
            app.UseAuthentication();

            app.UseSwagger();
            app.UseSwaggerUI(c => {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Best of the Worst API v1");
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            app.UseSpa(spa => {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment()) 
                {
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
        }
    }
}
