using System;
using System.Collections.Generic;
using System.Linq;
using Esf.Domain;
using Esf.DataAccess;
using Elasticsearch.Net;
using AutoMapper;
using Esf.Domain.Validation;

namespace Esf.WebApi.App_Start
{
    public class EsfWebApiDepencencyInjection
    {
        public void Load()
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

            Kernel.Bind<IEsfStateValidator>()
                  .To<EsfStateValidator>();

            Kernel.Bind<IEsfStateInputValidator>()
                  .To<EsfStateInputValidator>();

			IMapper autoMapper = AutoMapperBootstrapper.Bootstrap();
			Kernel.Bind<IMapper>().ToConstant(autoMapper);
		}		
	}
}