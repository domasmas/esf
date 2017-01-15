using Esf.Domain;
using Esf.Domain.Helpers;
using Esf.WebApi.Areas.EsfState;
using Nest;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Esf.WebApi.Areas.EsfQueryRunner
{
    [RoutePrefix("query-runner")]
    public class EsfQueryRunnerController : ApiController
    {
        [HttpPost]
        [Route("")]
        public async Task<string> Post([FromBody]EsfQueryRunnerDto esfState)
        {
            var esQueryRunnerDb = ConfigurationManager.ConnectionStrings["EsQueryRunnerDb"].ConnectionString;
            var esUri = new Uri(esQueryRunnerDb);
            var esClient = new ElasticClient(esUri);
            var uniqueNameResolver = new UniqueNameResolver();
            var esSessionFactory = new ElasticsearchSessionFactory(esClient, uniqueNameResolver);
            var esfQueryRunner = new Domain.EsfQueryRunner(esSessionFactory);
            return await esfQueryRunner.Run(esfState.Mapping, esfState.Documents.ToArray(), esfState.Query);
        }
    }
}
