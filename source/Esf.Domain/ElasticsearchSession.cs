using Elasticsearch.Net;
using Esf.Domain.Helpers;
using System;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class ElasticsearchSession : IElasticsearchSession
    {
        private readonly IElasticLowLevelClient _elasticClient;
        private readonly string _indexName;
        private readonly string _typeName;

        private IIdGenerator _idGenerator;

        public ElasticsearchSession(IElasticLowLevelClient elasticClient,
            IUniqueNameResolver uniqueNameResolver, IIdGenerator idGenerator)
        {
            _elasticClient = elasticClient;
            _indexName = uniqueNameResolver.GetUniqueName();
            _typeName = uniqueNameResolver.GetUniqueName();
            _idGenerator = idGenerator;
        }

        public async Task<EsfCreateResourceResponse> CreateMapping(string mappingObject)
        {
            var response = await _elasticClient.IndexAsync<string>(_indexName, _typeName, mappingObject);
            return GetEsfCreateResourceResponse(response);
        }

        public async Task<EsfCreateResourceResponse> InsertDocuments(params string[] documents)
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
                        _id = _idGenerator.NextId(),
                    }
                };

                var action = JSON.Serialize(actionObject);

                bulkBody.AppendLine(action);
                bulkBody.AppendLine(JSON.EnsureSingleLine(source));
                bulkBody.AppendLine();
            }

            var response = await _elasticClient.BulkPutAsync<string>(_indexName,
                _typeName,
                bulkBody.ToString(),
                x => x.Refresh(Elasticsearch.Net.Refresh.WaitFor));

            return GetEsfCreateResourceResponse(response);
        }

        private static EsfCreateResourceResponse GetEsfCreateResourceResponse(ElasticsearchResponse<string> response)
        {
            EsfError error = GetEsfResponseError(response);
            return new EsfCreateResourceResponse()
            {
                IsSuccess = response.Success,
                ElasticsearchError = error,

            };
        }

        public async Task<EsfQueryResponse> RunQuery(string query)
        {
            var response = await _elasticClient.SearchAsync<string>(_indexName, _typeName, query);
            return GetEsfResponse(response);
        }

        private static EsfQueryResponse GetEsfResponse(ElasticsearchResponse<string> response)
        {
            EsfError error = GetEsfResponseError(response);
            return new EsfQueryResponse()
            {
                IsSuccess = response.Success,
                SuccessJsonResult = response.Body,
                ElasticsearchError = error
            };
        }

        private static EsfError GetEsfResponseError(ElasticsearchResponse<string> response)
        {
            EsfError error;
            if (response.ServerError != null)
            {
                error = new EsfError()
                {
                    HttpStatusCode = response.ServerError.Status,
                    Error = response.ServerError.Error.ToString()
                };
            }
            else
            {
                error = null;
            }

            return error;
        }

        public void Cleanup()
        {
            _elasticClient.IndicesDelete<string>(_indexName);
        }

        public void Dispose()
        {
            Cleanup();
        }
    }
}