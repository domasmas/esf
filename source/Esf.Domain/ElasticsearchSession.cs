using Esf.Domain.Helpers;
using Nest;
using System;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class ElasticsearchSession : IElasticsearchSession
    {
        private readonly IElasticClient _elasticClient;
        private readonly string _indexName;
        private readonly string _typeName;

        private bool _indexCreated;

        public ElasticsearchSession(
            IElasticClient elasticClient, 
            IUniqueNameResolver uniqueNameResolver)
        {
            _elasticClient = elasticClient;
            _indexName = uniqueNameResolver.GetUniqueName();
            _typeName = uniqueNameResolver.GetUniqueName();
        }

        public async Task<bool> CreateMapping(string mappingObject)
        {
            if (_indexCreated)
                return true;

            var response = await _elasticClient.LowLevel.IndexAsync<string>(_indexName, _typeName, mappingObject);
            var responseBody = response.Body;

            _indexCreated = true;

            return true;
        }

        public async Task<bool> InsertDocuments(params string[] documents)
        {
            StringBuilder bulkBody = new StringBuilder();

            foreach (string source in documents)
            {
                var actionObject = new
                {
                    create = new
                    {
                        _index = _indexName,
                        _type = _typeName,
                        _id = Guid.NewGuid().ToString()
                    }
                };

                var action = JSON.Serialize(actionObject);

                bulkBody.AppendLine(action);
                bulkBody.AppendLine(JSON.EnsureSingleLine(source));
                bulkBody.AppendLine();
            }

            var response = await _elasticClient.LowLevel.BulkPutAsync<string>(_indexName, 
                _typeName, 
                bulkBody.ToString(), 
                x => x.Refresh(Elasticsearch.Net.Refresh.WaitFor));

            return response.Body != null;
        }

        public async Task<string> RunQuery(string query)
        {
            var response = await _elasticClient.SearchAsync<dynamic>(
                s => s.Index(_indexName)
                      .Type(_typeName)
                      .Query(q => q.Raw(query))
            );

            return JSON.Serialize(response.Documents);
        }

        public void Cleanup()
        {
            if (_indexCreated)
            {
                _elasticClient.DeleteIndex(new DeleteIndexRequest(_indexName));
                _indexCreated = false;
            }
        }

        public void Dispose()
        {
            Cleanup();
        }
    }
}