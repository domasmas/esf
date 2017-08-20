using Esf.Domain.Validation;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class EsfQueryRunner : IEsfQueryRunner
    {
        protected readonly IElasticsearchSessionFactory _elasticsearchFactory;
        protected readonly IEsfStateValidator _validator;

        public EsfQueryRunner(IElasticsearchSessionFactory elasticsearchFactory, IEsfStateValidator validator)
        {
            _elasticsearchFactory = elasticsearchFactory;
            _validator = validator;
        }
        
        public async Task<EsfQueryRunResult> Run(string mappingObject, string[] documents, string query)
        {
            _validator.Validate(mappingObject, query, documents);

            using (var session = _elasticsearchFactory.Create())
            {
                await session.CreateMapping(mappingObject);
                await session.InsertDocuments(documents);
                return await session.RunQuery(query);
            }
        }
    }
}
