using Elasticsearch.Net;
using Esf.Domain.Helpers;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain.Tests
{
    public class ElasticsearchFixture
    {
        private IEsfQueryRunner _esfQueryRunner;

        public ElasticsearchFixture(Uri esfQueryRunnerUri)
        {
            var esConfig = new ConnectionConfiguration(esfQueryRunnerUri);
            var esClient = new ElasticLowLevelClient(esConfig);
            var uniqueNameResolver = new UniqueNameResolver();
            var idGenerator = new IdGenerator();
            var elasticsearchFactory = new ElasticsearchSessionFactory(esClient, uniqueNameResolver, idGenerator);
            _esfQueryRunner = new EsfQueryRunner(elasticsearchFactory);
        }

        public EsfQuerySessionResponse RunQuery(object mapping, object[] documents, object query)
        {
            string serializedMapping = JSON.Serialize(mapping);
            string[] serializedDocuments = documents.Select((document) => JSON.Serialize(document)).ToArray();
            string serializedQuery = JSON.Serialize(query);

            return _esfQueryRunner.Run(serializedMapping, serializedDocuments, serializedQuery).Result;
        }

        public dynamic[] RunQueryRaw(string mapping, string[] documents, string query)
        {
            EsfQuerySessionResponse queryResult = _esfQueryRunner.Run(mapping, documents, query).Result;
            if (queryResult.QueryResponse == null)
                return null;
            if (queryResult.QueryResponse.IsSuccess)
            {
                dynamic queryBodyObject = JSON.Deserialize<object>(queryResult.QueryResponse.SuccessJsonResult);
                JArray hits = queryBodyObject.hits.hits;
                dynamic[] resultDocuments = hits.Select(hit => ((dynamic)hit)._source).ToArray();
                return resultDocuments;
            }
            else if (queryResult.QueryResponse.JsonValidationError != null)
                return new[] { queryResult.QueryResponse.JsonValidationError };
            else if (queryResult.QueryResponse.ElasticsearchError != null)
                return new[] { queryResult.QueryResponse.ElasticsearchError };
            else
                return null;
        }
    }
}
