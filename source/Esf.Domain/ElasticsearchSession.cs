using Elasticsearch.Net;
using Esf.Domain.Exceptions;
using Esf.Domain.Helpers;
using Esf.Domain.Validation;
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
        private IEsfStateInputValidator _validator;

        public ElasticsearchSession(IElasticLowLevelClient elasticClient,
                                    IUniqueNameResolver uniqueNameResolver, 
                                    IIdGenerator documentsIdGenerator,
                                    IEsfStateInputValidator validator)
        {
            _elasticClient = elasticClient;
            _indexName = uniqueNameResolver.GetUniqueName();
            _typeName = uniqueNameResolver.GetUniqueName();
            _documentsIdGenerator = documentsIdGenerator;
            _validator = validator;
        }

        public async Task CreateMapping(string mappingObject)
        {
            var response = await _elasticClient.IndexAsync<string>(_indexName, _typeName, mappingObject);
            ThrowIfError(response);
        }

        public async Task InsertDocuments(params string[] documents)
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
                x => x.Refresh(Refresh.WaitFor));

            ThrowIfError(response);
        }

        public async Task<EsfQueryRunResult> RunQuery(string query)
        {
            var response = await _elasticClient.SearchAsync<string>(_indexName, _typeName, query);
            ThrowIfError(response);

            return new EsfQueryRunResult
            {
                Result = response.Body
            };
        }

        private void ThrowIfError(ElasticsearchResponse<string> response)
        {
            if (!response.Success)
            {
                throw new EsfElasticSearchException
                { 
                    StatusCode = response.ServerError.Status,
                    ErrorMessage = response.ServerError.Error.ToString(),
                };
            }
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
