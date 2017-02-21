using Elasticsearch.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class ElasticsearchSessionFactory : IElasticsearchSessionFactory
    {
        private IElasticLowLevelClient _elasticClient;
        private IUniqueNameResolver _uniqueNameResolver;
        private IIdGenerator _idGenerator;

        public ElasticsearchSessionFactory(IElasticLowLevelClient elasticClient, IUniqueNameResolver uniqueNameResolver, IIdGenerator idGenerator)
        {
            _elasticClient = elasticClient;
            _uniqueNameResolver = uniqueNameResolver;
            _idGenerator = idGenerator;
        }

        public IElasticsearchSession Create()
        {
            return new ElasticsearchSession(_elasticClient, _uniqueNameResolver, _idGenerator);
        }
    }
}
