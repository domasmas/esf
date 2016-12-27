using Esf.Domain.Helpers;
using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public interface IElasticsearchSession
    {
        Task<bool> CreateIndex();
        Task<bool> CreateMapping(dynamic mappingObject);
        Task<bool> InsertDocuments(dynamic[] documents);
        Task<ISearchResponse<dynamic>> RunQuery(dynamic query);
        void Cleanup();
    }

    public class ElasticsearchSession : IElasticsearchSession, IDisposable
    {
        private readonly ElasticClient _elasticClient;
        private readonly IEsfHttpClient _httpClient;
        private readonly IUniqueNameResolver _uniqueNameResolver;
        private readonly string _indexName;
        private readonly string _typeName;

        private bool _indexCreated;
        private bool _mappingCreated;

        public ElasticsearchSession(
            ElasticClient elasticClient, 
            IEsfHttpClient httpClient, 
            IUniqueNameResolver uniqueNameResolver)
        {
            _elasticClient = elasticClient;
            _httpClient = httpClient;
            _uniqueNameResolver = uniqueNameResolver;
            _indexName = uniqueNameResolver.GetUniqueName("index_");
            _typeName = uniqueNameResolver.GetUniqueName("type_");
        }

        public async Task<bool> CreateIndex()
        {
            if (_indexCreated)
                return true;

            var response = await _elasticClient.CreateIndexAsync(new IndexName() { Name = _indexName });
            _indexCreated = response.Acknowledged;

            return response.Acknowledged;
        }

        public async Task<bool> CreateMapping(dynamic mappingObject)
        {
            if (_mappingCreated)
                return true;

            var serializedBody = JSON.Serialize(mappingObject);
            var httpResponse = await _httpClient.Put(serializedBody, _indexName, "_mapping", _typeName);
            var httpResponseObject = JSON.Deserialize<dynamic>(httpResponse);
            _mappingCreated = httpResponseObject.acknowledged;

            return httpResponseObject.acknowledged;
        }

        public Task<bool> InsertDocuments(dynamic[] documents)
        {
            List<dynamic> httpResponses = new List<dynamic>();

            var tasks = documents.Select(async d =>
            {
                var httpResponse = await _httpClient.Put(JSON.Serialize(d), _indexName, _typeName, Guid.NewGuid().ToString() + "?refresh=wait_for");
                httpResponses.Add(JSON.Deserialize<dynamic>(httpResponse));
                return Task.FromResult(true);
            });

            Task.WaitAll(tasks.ToArray());

            return Task.FromResult(httpResponses.All(r => r.created));
        }

        public async Task<ISearchResponse<dynamic>> RunQuery(dynamic query)
        {
            var serializedQuery = JSON.Serialize(query);

            return await _elasticClient.SearchAsync<dynamic>(
                s => s.Index(_indexName)
                      .Type(_typeName)
                      .Query(q => q.Raw(serializedQuery))
            );
        }

        public void Cleanup()
        {
            if (_indexCreated)
            {
                _elasticClient.DeleteIndex(new DeleteIndexRequest(_indexName));
            }
        }

        public void Dispose()
        {
            Cleanup();
        }
    }
}