using Ninject.Modules;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Ninject;
using System.Configuration;
using Nest;
using Esf.Domain;
using Esf.DataAccess;

namespace Esf.WebApi.App_Start
{
    public class EsfWebApiDepencencyInjection : NinjectModule
    {
        public override void Load()
        {
            var connections = ConfigurationManager.ConnectionStrings;

            Kernel.Bind<IElasticClient>()
                  .To<ElasticClient>()
                  .WithConstructorArgument(new Uri(connections["EsQueryRunnerDb"].ConnectionString));

            Kernel.Bind<IUniqueNameResolver>()
                  .To<UniqueNameResolver>();

            Kernel.Bind<IElasticsearchSessionFactory>()
                  .To<ElasticsearchSessionFactory>();

            Kernel.Bind<IEsfQueryRunner>()
                  .To<EsfQueryRunner>();

            Kernel.Bind<INewEsfStateFactory>()
                  .To<NewEsfStateFactory>();

            Kernel.Bind<IEsStatesRepository>()
                  .To<EsStatesRepository>();

            Kernel.Bind<IEsDatabaseClient>()
                  .To<EsDatabaseClient>()
                  .WithConstructorArgument(connections["EsFiddleDb"].ConnectionString);
        }
    }
}