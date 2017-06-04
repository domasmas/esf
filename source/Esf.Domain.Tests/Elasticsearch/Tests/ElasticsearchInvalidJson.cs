using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Esf.Domain.Tests.Elasticsearch.Tests
{
    public class ElasticsearchInvalidJson : ElasticsearchTestsBase
    {
        [Fact]
        public void InvalidMapppingJson()
        {
            var mapping = @"{""properties"": {""message"": {""type"": ""string""}, ""something"": {""}}}";
            var documents = new string[] { };
            var query = "";

            EsfQuerySessionResponse sessionResponse = _esfQueryRunner.RunRawQuery(mapping, documents, query).SessionResponse;
            JsonError mappingJsonValidationError = sessionResponse.CreateMappingResponse.JsonValidationError;
            _esfQueryRunner.LogTestRun(mappingJsonValidationError);

            Assert.Equal(mapping, mappingJsonValidationError.SourceJson);
            Assert.True(mappingJsonValidationError.Error.Contains("Unterminated string. Expected delimiter: \". Path 'properties.something'"), "mapping creation expected to fail with JSON validation error");
        }

        [Fact]
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

            Assert.Equal(documents[1], documentsJsonValidationError.SourceJson);
            Assert.True(documentsJsonValidationError.Error.Contains("Unexpected character encountered while parsing value: T"), "documents creation expected to fail with JSON validation error");
        }

        [Fact]
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

            Assert.Equal(query, queryJsonValidationError.SourceJson);
            Assert.True(queryJsonValidationError.Error.Contains("After parsing a value an unexpected character was encountered: :"), "query run expected to fail with JSON validation error");
        }
    }
}
