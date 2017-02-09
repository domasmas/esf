using Elasticsearch.Net;
using Esf.Domain.Helpers;
using Moq;
using NUnit.Framework;
using System;
using System.Linq;

namespace Esf.Domain.Tests
{
    [TestFixture]
    public class ElasticsearchSessionTests
    {
        [SetUp]
        public static void Initialize()
        {
            var esfQueryRunnerUri = new Uri("http://localhost:9200");
            _esfQueryRunner = new ElasticsearchFixture(esfQueryRunnerUri);
        }

        private static ElasticsearchFixture _esfQueryRunner;

        [Test]
        public void MatchQueryWithSingleMatch()
        {
            const string message = "The quick brown fox jumps over the lazy dog";

            var mapping = @"{""properties"": {""message"": {""type"": ""string"", ""store"": true}}}";

            var documents = new[] {
                $"{{\"message\": \"{message}\"}}"
            };

            var query = @"{ ""query"" : {""match"": {""message"": ""fox""}} }";

            var resultDocuments = _esfQueryRunner.RunQueryRaw(mapping, documents, query);

            Assert.AreEqual(1, resultDocuments.Count());
            Assert.AreEqual(message, resultDocuments[0].message.ToString());
        }

        [Test]
        public void MatchQueryWithMultipleMatch()
        {
            const string message1 = "The quick brown fox jumps over the lazy dog";
            const string message2 = "The fox changes his fur but not his habits";

            var mapping = @"{""properties"": {""message"": {""type"": ""string"", ""store"": true}}}";

            var documents = new[] {
                $"{{\"message\": \"{message1}\"}}",
                $"{{\"message\": \"{message2}\"}}"
            };

            var query = @"{ ""query"" : {""match"": {""message"": ""fox""}} }";

            var resultDocuments = _esfQueryRunner.RunQueryRaw(mapping, documents, query);

            Assert.AreEqual(2, resultDocuments.Count());
            Assert.IsTrue(resultDocuments.Any(d => d.message == message1));
            Assert.IsTrue(resultDocuments.Any(d => d.message == message2));
        }

        [Test]
        public void NoMatch()
        {
            var mapping = @"{""properties"": {""message"": {""type"": ""string"", ""store"": true}}}";

            var documents = new[] {
                @"{""message"": ""The quick brown fox jumps over the lazy dog""}",
                @"{""message"": ""The fox changes his fur but not his habits""}"
            };

            var query = @"{ ""query"" : {""match"": {""message"": ""lion""}} }";

            var resultDocuments = _esfQueryRunner.RunQueryRaw(mapping, documents, query);

            Assert.AreEqual(0, resultDocuments.Count());
        }

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
            var idGenerator = new IdGenerator();

            using (var session = new ElasticsearchSession(esClient, uniqueNameResolverMock.Object, idGenerator))
            {
                var mappingCreated = session.CreateMapping(mapping).Result.IsSuccess;
                var documentsCreated = session.InsertDocuments(documents).Result.IsSuccess;

                var indexExistsResponse = esClient.IndicesGet<string>(indexAndTypeName);
                Assert.IsTrue(indexExistsResponse.Success);

                Assert.IsTrue(mappingCreated);
                Assert.IsTrue(documentsCreated);
            }

            var indexExistsResponse2 = esClient.IndicesGet<string>(indexAndTypeName);
            Assert.IsFalse(indexExistsResponse2.Success);
        }
    }
}
