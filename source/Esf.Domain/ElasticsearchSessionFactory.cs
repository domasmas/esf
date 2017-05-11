using Elasticsearch.Net;
using Esf.Domain.Validation;

namespace Esf.Domain
{
    public class ElasticsearchSessionFactory : IElasticsearchSessionFactory
    {
        private IElasticLowLevelClient _elasticClient;
        private IUniqueNameResolver _uniqueNameResolver;
        private IIdGenerator _idGenerator;
        private IEsfStateInputValidator _validator;

        public ElasticsearchSessionFactory(
                IElasticLowLevelClient elasticClient, 
                IUniqueNameResolver uniqueNameResolver, 
                IIdGenerator idGenerator, 
                IEsfStateInputValidator validator)
        {
            _elasticClient = elasticClient;
            _uniqueNameResolver = uniqueNameResolver;
            _idGenerator = idGenerator;
            _validator = validator;
        }

        public IElasticsearchSession Create()
        {
            return new ElasticsearchSession(_elasticClient, _uniqueNameResolver, _idGenerator, _validator);
        }
    }
}
