using Elasticsearch.Net;
using Esf.Domain.Validation;
using Moq;
using NUnit.Framework;
using System;

namespace Esf.Domain.Tests.Elasticsearch.Tests
{
    [TestFixture]
    public class ElasticsearchSession
    {
        [Test]
        public void CheckSessionIndexIsDeleted()
        {
            string indexAndTypeName = $"index_{Guid.NewGuid().ToString()}";

            var mapping = @"{""properties"": {""message"": {""type"": ""string"", ""store"": true}}}";
            var documents = @"[{""message"": ""The quick brown fox jumps over the lazy dog""}]";

            var esUri = new Uri("http://localhost:9200");
            var config = new ConnectionConfiguration(esUri);
            var esClient = new ElasticLowLevelClient(config);

            var uniqueNameResolverMock = new Mock<IUniqueNameResolver>();
            uniqueNameResolverMock.Setup(r => r.GetUniqueName()).Returns(indexAndTypeName);
            var idGeneratorMock = new Mock<IIdGenerator>();
            idGeneratorMock.Setup(g => g.NextId()).Returns(1);
            var validator = new EsfStateInputValidator();

            using (var session = new Domain.ElasticsearchSession(esClient, uniqueNameResolverMock.Object, idGeneratorMock.Object, validator))
            {
                session.CreateMapping(mapping);
                session.InsertDocuments(documents);

                var indexExistsResponse = esClient.IndicesGet<string>(indexAndTypeName);
                Assert.IsTrue(indexExistsResponse.Success);
            }

            var indexExistsResponse2 = esClient.IndicesGet<string>(indexAndTypeName);
            Assert.IsFalse(indexExistsResponse2.Success);
        }
    }
}
