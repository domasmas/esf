using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain.Tests.Elasticsearch
{
    public abstract class ElasticsearchTestsBase
    {
        public ElasticsearchTestsBase()
        {
            var uri = new Uri("http://localhost:9200");
            _esfQueryRunner = new ElasticsearchFixture(uri);
        }

        protected ElasticsearchFixture _esfQueryRunner;
    }
}
