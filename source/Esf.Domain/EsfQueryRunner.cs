using System.Threading.Tasks;

namespace Esf.Domain
{
    public class EsfQueryRunner : IEsfQueryRunner
    {
        private IElasticsearchSessionFactory _elasticsearchFactory;

        public EsfQueryRunner(IElasticsearchSessionFactory elasticsearchFactory)
        {
            _elasticsearchFactory = elasticsearchFactory;
        }
        
        public async Task<EsfQuerySessionResponse> Run(string mappingObject, string[] documents, string query)
        {
            using (var session = _elasticsearchFactory.Create())
            {
                EsfCreateResourceResponse mappingResponse = await session.CreateMapping(mappingObject);
                if (!mappingResponse.IsSuccess)
                    return CreateResponse(mappingResponse, null, null);

                EsfCreateResourceResponse documentsResponse = await session.InsertDocuments(documents);
                if (!documentsResponse.IsSuccess)
                    return CreateResponse(mappingResponse, documentsResponse, null);

                EsfQueryResponse queryResponse = await session.RunQuery(query);
                return CreateResponse(mappingResponse, documentsResponse, queryResponse);
            }
        }

        private EsfQuerySessionResponse CreateResponse(EsfCreateResourceResponse mappingResponse, EsfCreateResourceResponse documentsResponse, EsfQueryResponse queryResponse)
        {
            return new EsfQuerySessionResponse()
            {
                CreateMappingResponse = mappingResponse,
                CreateDocumentsResponse = documentsResponse,
                QueryResponse = queryResponse
            };
        }
    }
}
