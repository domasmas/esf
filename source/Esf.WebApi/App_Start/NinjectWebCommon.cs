[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(Esf.WebApi.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethodAttribute(typeof(Esf.WebApi.App_Start.NinjectWebCommon), "Stop")]

namespace Esf.WebApi.App_Start
{
    using System;
    using System.Web;

    using Microsoft.Web.Infrastructure.DynamicModuleHelper;

    using Ninject;
    using Ninject.Web.Common;
    using Nest;
    using System.Configuration;
    using Domain;
    using DataAccess;

    public static class NinjectWebCommon 
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start() 
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
        }
        
        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            bootstrapper.ShutDown();
        }
        
        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            try
            {
                kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

                RegisterServices(kernel);
                return kernel;
            }
            catch
            {
                kernel.Dispose();
                throw;
            }
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            var connections = ConfigurationManager.ConnectionStrings;

            kernel.Bind<IElasticClient>()
                  .To<ElasticClient>()
                  .WithConstructorArgument(new Uri(connections["EsQueryRunnerDb"].ConnectionString));

            kernel.Bind<IUniqueNameResolver>()
                  .To<UniqueNameResolver>();

            kernel.Bind<IElasticsearchSessionFactory>()
                  .To<ElasticsearchSessionFactory>();

            kernel.Bind<IEsfQueryRunner>()
                  .To<EsfQueryRunner>();

            kernel.Bind<INewEsfStateFactory>()
                  .To<NewEsfStateFactory>();

            kernel.Bind<IEsStatesRepository>()
                  .To<EsStatesRepository>();

            kernel.Bind<IEsDatabaseClient>()
                  .To<EsDatabaseClient>()
                  .WithConstructorArgument(connections["EsFiddleDb"].ConnectionString);
        }        
    }
}
