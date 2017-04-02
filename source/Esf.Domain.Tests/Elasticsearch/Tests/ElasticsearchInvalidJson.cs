using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain.Tests.Elasticsearch.Tests
{
    public class ElasticsearchInvalidJson : ElasticsearchTestsBase
    {
        [Test]
        public void InvalidMapppingJson()
        {
            var mapping = @"{""properties"": {""message"": {""type"": ""string""}, ""something"": {""}}}";
            var documents = new string[] { };
            var query = "";

            EsfQuerySessionResponse sessionResponse = _esfQueryRunner.RunRawQuery(mapping, documents, query).SessionResponse;
            JsonError mappingJsonValidationError = sessionResponse.CreateMappingResponse.JsonValidationError;
            _esfQueryRunner.LogTestRun(mappingJsonValidationError);

            Assert.AreEqual(mapping, mappingJsonValidationError.SourceJson);
            Assert.IsTrue(mappingJsonValidationError.Error.Contains("Unterminated string. Expected delimiter: \". Path 'properties.something'"), "mapping creation expected to fail with JSON validation error");
        }

        [Test]
        public void InvalidDocumntsJson()
        {
            var mapping = @"{""properties"": {""message"": {""type"": ""string""} }}";
            var documents = new[] {
                @"{""message"": ""The quick brown fox jumps over the lazy dog""}",
                @"{""message"": The fox changes his fur but not his habits}"
            };
            var query = "";

            EsfQuerySessionResponse sessionResponse = _esfQueryRunner.RunRawQuery(mapping, documents, query).SessionResponse;
            JsonError documentsJsonValidationError = sessionResponse.CreateDocumentsResponse.JsonValidationError;
            _esfQueryRunner.LogTestRun(documentsJsonValidationError);

            Assert.AreEqual(documents[1], documentsJsonValidationError.SourceJson);
            Assert.IsTrue(documentsJsonValidationError.Error.Contains("Unexpected character encountered while parsing value: T"), "documents creation expected to fail with JSON validation error");
        }

        [Test]
        public void InvalidQueryJson()
        {
            var mapping = @"{""properties"": {""message"": {""type"": ""string""}}}";
            var documents = new[] {
                @"{""message"": ""The quick brown fox jumps over the lazy dog""}",
                @"{""message"": ""The fox changes his fur but not his habits""}"
            };
            var query = @"{ ""query"" : {""match"": ""message"": ""lion""} }";

            EsfQuerySessionResponse sessionResponse = _esfQueryRunner.RunRawQuery(mapping, documents, query).SessionResponse;
            JsonError queryJsonValidationError = sessionResponse.QueryResponse.JsonValidationError;
            _esfQueryRunner.LogTestRun(queryJsonValidationError);

            Assert.AreEqual(query, queryJsonValidationError.SourceJson);
            Assert.IsTrue(queryJsonValidationError.Error.Contains("After parsing a value an unexpected character was encountered: :"), "query run expected to fail with JSON validation error");
        }
    }
}
