using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Elasticsearch.Net;
using Esf.Domain;
using Esf.DataAccess;
using Esf.Domain.Validation;
using AutoMapper;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Esf.WebApi.Filters;
using Esf.Domain.Exceptions;

namespace Esf.WebApi.NetCore
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            ConfigureDI(services, Configuration);

            // Add framework services.
            services.AddMvc(config =>
            {
                config.Filters.Add(new EsfExceptionFilterAttribute(new EsfExceptionSerializer()));
            });
            services.AddCors();
        }

        private static void ConfigureDI(IServiceCollection services, IConfigurationRoot configuration)
        {
            string EsQueryRunnerDbConnectionString = configuration.GetConnectionString("EsQueryRunnerDb");

            var esConnectionConfiguration = new ConnectionConfiguration(new Uri(EsQueryRunnerDbConnectionString));

            services.AddScoped<IElasticLowLevelClient, ElasticLowLevelClient>((serviceProvider) => new ElasticLowLevelClient(esConnectionConfiguration));
            services.AddTransient<IUniqueNameResolver, UniqueNameResolver>();
            services.AddTransient<IIdGenerator, IdGenerator>();
            services.AddScoped<IElasticsearchSessionFactory, ElasticsearchSessionFactory>();;
            services.AddScoped<IEsfQueryRunner, EsfQueryRunner>();
            services.AddScoped<INewEsfStateFactory, NewEsfStateFactory>();
            services.AddScoped<IEsStatesRepository, EsStatesRepository>();
            
            string esFiddleDbConnectionString = configuration.GetConnectionString("EsFiddleDb");
            services.AddScoped<IEsDatabaseClient, EsDatabaseClient>(serviceProvider => new EsDatabaseClient(esFiddleDbConnectionString));
            services.AddTransient<IEsfStateValidator, EsfStateValidator>();
            services.AddTransient<IEsfStateInputValidator, EsfStateInputValidator>();
            IMapper autoMapper = AutoMapperBootstrapper.Bootstrap();
            services.AddSingleton(autoMapper);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            //configuring CORS must happen before UseMvc
            app.UseCors(policy => policy.AllowAnyOrigin()
                                        .AllowAnyMethod()
                                        .AllowAnyHeader());

            app.UseMvc();
        }
    }
}
