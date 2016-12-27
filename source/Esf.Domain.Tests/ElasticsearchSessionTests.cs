using Esf.Domain.Helpers;
using Moq;
using Nest;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Esf.Domain.Tests
{
    [TestFixture]
    public class ElasticsearchSessionTests
    {
        [Test]
        public void MatchQueryWithSingleMatch()
        {
            var mapping = JSON.Deserialize<dynamic>(@"{""properties"": {""message"": {""type"": ""string"", ""store"": true}}}");
            var documents = JSON.Deserialize<dynamic[]>(@"[{""message"": ""The quick brown fox jumps over the lazy dog""}]");
            var query = JSON.Deserialize<dynamic>(@"{""match"": {""message"": ""fox""}}");

            var queryResult = RunSearchQuery(mapping, documents, query);

            Assert.AreEqual(1, queryResult.Documents.Count);
            Assert.AreEqual(documents[0].message, ((IEnumerable<dynamic>)queryResult.Documents).First().message);
        }

        [Test]
        public void MatchQueryWithMultipleMatch()
        {
            var mapping = JSON.Deserialize<dynamic>(@"{""properties"": {""message"": {""type"": ""string"", ""store"": true}}}");
            var documents = JSON.Deserialize<dynamic[]>(
                @"[
                    {""message"": ""The quick brown fox jumps over the lazy dog""},
                    {""message"": ""The fox changes his fur but not his habits""}
                  ]"
            );
            var query = JSON.Deserialize<dynamic>(@"{""match"": {""message"": ""fox""}}");

            var queryResult = RunSearchQuery(mapping, documents, query);

            Assert.AreEqual(2, queryResult.Documents.Count);
            Assert.IsTrue(((IEnumerable<dynamic>)queryResult.Documents).Any(d => d.message == documents[0].message));
            Assert.IsTrue(((IEnumerable<dynamic>)queryResult.Documents).Any(d => d.message == documents[1].message));
        }

        [Test]
        public void NoMatch()
        {
            var mapping = JSON.Deserialize<dynamic>(@"{""properties"": {""message"": {""type"": ""string"", ""store"": true}}}");
            var documents = JSON.Deserialize<dynamic[]>(
                @"[
                    {""message"": ""The quick brown fox jumps over the lazy dog""},
                    {""message"": ""The fox changes his fur but not his habits""}
                  ]"
            );
            var query = JSON.Deserialize<dynamic>(@"{""match"": {""message"": ""lion""}}");

            var queryResult = RunSearchQuery(mapping, documents, query);

            Assert.AreEqual(0, queryResult.Documents.Count);
        }

        [Test]
        public void CheckSessionIndexIsDeleted()
        {
            string indexAndTypeName = $"index_{Guid.NewGuid().ToString()}";

            var mapping = JSON.Deserialize<dynamic>(@"{""properties"": {""message"": {""type"": ""string"", ""store"": true}}}");
            var documents = JSON.Deserialize<dynamic[]>(@"[{""message"": ""The quick brown fox jumps over the lazy dog""}]");
            var query = JSON.Deserialize<dynamic>(@"{""match"": {""message"": ""fox""}}");

            var esUri = new Uri("http://localhost:9200");
            var esClient = new ElasticClient(esUri);
            var esfHttpClient = new EsfHttpClient(esUri);

            var uniqueNameResolverMock = new Mock<IUniqueNameResolver>();
            uniqueNameResolverMock.Setup(r => r.GetUniqueName(It.IsAny<string>(), It.IsAny<string>())).Returns(indexAndTypeName);

            using (var session = new ElasticsearchSession(esClient, esfHttpClient, uniqueNameResolverMock.Object))
            {
                var indexCreated = session.CreateIndex().Result;
                var mappingCreated = session.CreateMapping(mapping).Result;
                var documentsCreated = session.InsertDocuments(documents).Result;

                var indexExistsResponse = esClient.IndexExists(new IndexExistsRequest(indexAndTypeName));
                Assert.IsTrue(indexExistsResponse.Exists);

                Assert.IsTrue(indexCreated);
                Assert.IsTrue(mappingCreated);
                Assert.IsTrue(documentsCreated);
            }

            var indexExistsResponse2 = esClient.IndexExists(new IndexExistsRequest(indexAndTypeName));
            Assert.IsFalse(indexExistsResponse2.Exists);
        }

        private ISearchResponse<dynamic> RunSearchQuery(dynamic mapping, dynamic documents, dynamic query)
        {
            var esUri = new Uri("http://localhost:9200");
            var esClient = new ElasticClient(esUri);
            var esfHttpClient = new EsfHttpClient(esUri);
            var uniqueNameResolver = new UniqueNameResolver();

            using (var session = new ElasticsearchSession(esClient, esfHttpClient, uniqueNameResolver))
            {
                var indexCreated = session.CreateIndex().Result;
                var mappingCreated = session.CreateMapping(mapping).Result;
                var documentsCreated = session.InsertDocuments(documents).Result;
                var queryResult = (ISearchResponse<dynamic>)session.RunQuery(query).Result;

                Assert.IsTrue(indexCreated);
                Assert.IsTrue(mappingCreated);
                Assert.IsTrue(documentsCreated);

                return queryResult;
            }
        }
    }
}
