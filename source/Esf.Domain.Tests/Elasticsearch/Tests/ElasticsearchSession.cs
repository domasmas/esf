﻿using Elasticsearch.Net;
using Esf.Domain.Helpers;
using Esf.Domain.Validation;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;

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