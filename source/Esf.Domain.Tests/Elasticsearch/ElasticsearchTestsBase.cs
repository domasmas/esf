using NUnit.Framework;
using System;

namespace Esf.Domain.Tests.Elasticsearch
{
    [TestFixture]
    public abstract class ElasticsearchTestsBase
    {
        [SetUp]
        public static void Initialize()
        {
            var uri = new Uri("http://localhost:9200");
            _esfQueryRunner = new ElasticsearchFixture(uri);
        }

        protected static ElasticsearchFixture _esfQueryRunner;
    }
}
