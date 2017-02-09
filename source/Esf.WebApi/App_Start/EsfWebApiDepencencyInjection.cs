using Ninject.Modules;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Ninject;
using System.Configuration;
using Esf.Domain;
using Esf.DataAccess;
using Elasticsearch.Net;

namespace Esf.WebApi.App_Start
{
    public class EsfWebApiDepencencyInjection : NinjectModule
    {
        public override void Load()
        {
            var connections = ConfigurationManager.ConnectionStrings;

            var esConnectionConfiguration = new ConnectionConfiguration(new Uri(connections["EsQueryRunnerDb"].ConnectionString));
            Kernel.Bind<IElasticLowLevelClient>()
                  .To<ElasticLowLevelClient>()
                  .WithConstructorArgument(esConnectionConfiguration);

            Kernel.Bind<IUniqueNameResolver>()
                  .To<UniqueNameResolver>();
            Kernel.Bind<IIdGenerator>()
                  .To<IdGenerator>();

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