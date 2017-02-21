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

        private IIdGenerator _documentsIdGenerator;

        public ElasticsearchSession(IElasticLowLevelClient elasticClient,
            IUniqueNameResolver uniqueNameResolver, IIdGenerator documentsIdGenerator)
        {
            _elasticClient = elasticClient;
            _indexName = uniqueNameResolver.GetUniqueName();
            _typeName = uniqueNameResolver.GetUniqueName();
            _documentsIdGenerator = documentsIdGenerator;
        }

        public async Task<EsfResponse> CreateMapping(string mappingObject)
        {
            EsfResponse invalidJsonResponse = TestInvalidJson(mappingObject);
            if (invalidJsonResponse != null)
            {
                return invalidJsonResponse;
            }
            var response = await _elasticClient.IndexAsync<string>(_indexName, _typeName, mappingObject);
            return GetEsfResponse(response);
        }

        public async Task<EsfResponse> InsertDocuments(params string[] documents)
        {
            StringBuilder bulkBody = new StringBuilder();

            foreach (string source in documents)
            {
                EsfResponse invalidJsonResponse = TestInvalidJson(source);
                if (invalidJsonResponse != null)
                {
                    return invalidJsonResponse;
                }
                var actionObject = new
                {
                    create = new
                    {
                        _index = _indexName,
                        _type = _typeName,
                        _id = _documentsIdGenerator.NextId(),
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

            return GetEsfResponse(response);
        }

        public async Task<EsfResponse> RunQuery(string query)
        {
            EsfResponse invalidJsonResponse = TestInvalidJson(query);
            if (invalidJsonResponse != null)
            {
                return invalidJsonResponse;
            }
            var response = await _elasticClient.SearchAsync<string>(_indexName, _typeName, query);
            return GetEsfResponse(response);
        }

        private static EsfResponse TestInvalidJson(string serializedJson)
        {
            try
            {
                dynamic result = JSON.Deserialize<dynamic>(serializedJson);
                return null;
            }
            catch (Exception ex)
            {
                var jsonValidationError = new JsonError()
                {
                    Error = ex.Message,
                    SourceJson = serializedJson
                };
                return new EsfResponse()
                {
                    IsSuccess = false,
                    JsonValidationError = jsonValidationError,
                    ElasticsearchError = null,
                    SuccessJsonResult = null
                };
            }
        }

        private static EsfResponse GetEsfResponse(ElasticsearchResponse<string> response)
        {
            EsfError error = GetEsfResponseError(response);
            return new EsfResponse()
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