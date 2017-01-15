using Esf.Domain.Helpers;
using Moq;
using Nest;
using NUnit.Framework;
using System;
using System.Linq;

namespace Esf.Domain.Tests
{
    [TestFixture]
    public class ElasticsearchSessionTests
    {
        [Test]
        public void MatchQueryWithSingleMatch()
        {
            const string message = "The quick brown fox jumps over the lazy dog";

            var mapping = @"{""properties"": {""message"": {""type"": ""string"", ""store"": true}}}";

            var documents = new[] {
                $"{{\"message\": \"{message}\"}}"
            };

            var query = @"{""match"": {""message"": ""fox""}}";

            var resultString = RunSearchQuery(mapping, documents, query);
            var resultDocuments = JSON.Deserialize<dynamic[]>(resultString);

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

            var query = @"{""match"": {""message"": ""fox""}}";

            var resultString = RunSearchQuery(mapping, documents, query);
            var resultDocuments = JSON.Deserialize<dynamic[]>(resultString);

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

            var query = @"{""match"": {""message"": ""lion""}}";

            var resultString = RunSearchQuery(mapping, documents, query);
            var resultDocuments = JSON.Deserialize<dynamic[]>(resultString);

            Assert.AreEqual(0, resultDocuments.Count());
        }

        [Test]
        public void CheckSessionIndexIsDeleted()
        {
            string indexAndTypeName = $"index_{Guid.NewGuid().ToString()}";

            var mapping = @"{""properties"": {""message"": {""type"": ""string"", ""store"": true}}}";
            var documents = @"[{""message"": ""The quick brown fox jumps over the lazy dog""}]";

            var esUri = new Uri("http://localhost:9200");
            var esClient = new ElasticClient(esUri);

            var uniqueNameResolverMock = new Mock<IUniqueNameResolver>();
            uniqueNameResolverMock.Setup(r => r.GetUniqueName()).Returns(indexAndTypeName);

            using (var session = new ElasticsearchSession(esClient, uniqueNameResolverMock.Object))
            {
                var mappingCreated = session.CreateMapping(mapping).Result;
                var documentsCreated = session.InsertDocuments(documents).Result;

                var indexExistsResponse = esClient.IndexExists(new IndexExistsRequest(indexAndTypeName));
                Assert.IsTrue(indexExistsResponse.Exists);

                Assert.IsTrue(mappingCreated);
                Assert.IsTrue(documentsCreated);
            }

            var indexExistsResponse2 = esClient.IndexExists(new IndexExistsRequest(indexAndTypeName));
            Assert.IsFalse(indexExistsResponse2.Exists);
        }

        private string RunSearchQuery(string mapping, string[] documents, string query)
        {
            var esUri = new Uri("http://localhost:9200");
            var esClient = new ElasticClient(esUri);
            var uniqueNameResolver = new UniqueNameResolver();
            var elasticsearchFactory = new ElasticsearchSessionFactory(esClient, uniqueNameResolver);
            var esfQueryRunner = new EsfQueryRunner(elasticsearchFactory);
            return esfQueryRunner.Run(mapping, documents, query).Result;
        }
    }
}
