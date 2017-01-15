using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class ElasticsearchSessionFactory : IElasticsearchSessionFactory
    {
        private IElasticClient _elasticClient;
        private IUniqueNameResolver _uniqueNameResolver;

        public ElasticsearchSessionFactory(IElasticClient elasticClient, IUniqueNameResolver uniqueNameResolver)
        {
            _elasticClient = elasticClient;
            _uniqueNameResolver = uniqueNameResolver;
        }

        public IElasticsearchSession Create()
        {
            return new ElasticsearchSession(_elasticClient, _uniqueNameResolver);
        }
    }
}
