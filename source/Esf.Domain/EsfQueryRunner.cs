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
                EsfResponse mappingResponse = await session.CreateMapping(mappingObject);
                var blankUnuccessfulReponse = new EsfResponse()
                {
                    IsSuccess = false
                };
                if (!mappingResponse.IsSuccess)
                    return CreateResponse(mappingResponse, blankUnuccessfulReponse, blankUnuccessfulReponse);

                EsfResponse documentsResponse = await session.InsertDocuments(documents);
                if (!documentsResponse.IsSuccess)
                    return CreateResponse(mappingResponse, documentsResponse, blankUnuccessfulReponse);

                EsfResponse queryResponse = await session.RunQuery(query);
                return CreateResponse(mappingResponse, documentsResponse, queryResponse);
            }
        }

        private EsfQuerySessionResponse CreateResponse(EsfResponse mappingResponse, EsfResponse documentsResponse, EsfResponse queryResponse)
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
