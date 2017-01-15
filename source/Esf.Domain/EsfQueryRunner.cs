using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
        
        public async Task<string> Run(string mappingObject, string[] documents, string query)
        {
            using (var session = _elasticsearchFactory.Create())
            {
                bool isMappingCreated = await session.CreateMapping(mappingObject);
                if (!isMappingCreated)
                    throw new QueryRunnerException("Mapping is not created");
                bool areDocumentsCreated = await session.InsertDocuments(documents);
                if (!areDocumentsCreated)
                    throw new QueryRunnerException("Documents are not created");

                return await session.RunQuery(query);
            }
        }
    }
}
