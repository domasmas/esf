using Esf.Domain.Exceptions;
using NUnit.Framework;
using System;
using System.Linq;

namespace Esf.Domain.Tests.Elasticsearch.Tests
{
    public class ElasticsearchInvalidJson : ElasticsearchTestsBase
    {
        [Test]
        public void InvalidMappingJson()
        {
            var mapping = @"{""properties"": {""message"": {""type"": ""string""}, ""something"": {""}}}";
            var documents = new string[] { };
            var query = "";

            bool success;
            string[] errorMessages = new string[0];

            try
            {
                var sessionResponse = _esfQueryRunner.RunRawQuery(mapping, documents, query).SessionResponse;
                success = true;
            }
            catch (AggregateException aggException)
            {
                var ex = aggException.InnerException as EsfInvalidStateException;
                success = false;
                errorMessages = ex.Mapping;
            }

            Assert.IsFalse(success, "expected unsuccessful query run result");

            _esfQueryRunner.LogTestRun(String.Join(",", errorMessages));

            Assert.IsTrue(errorMessages.Any(x => x.Contains("Unterminated string. Expected delimiter: \". Path 'properties.something'")), "mapping creation expected to fail with JSON validation error");
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

            bool success;
            string[] errorMessages = new string[0];

            try
            {
                var sessionResponse = _esfQueryRunner.RunRawQuery(mapping, documents, query).SessionResponse;
                success = true;
            }
            catch (AggregateException aggException)
            {
                var ex = aggException.InnerException as EsfInvalidStateException;
                success = false;
                errorMessages = ex.Documents;
            }

            Assert.IsFalse(success);

            _esfQueryRunner.LogTestRun(String.Join(",", errorMessages));

            Assert.IsTrue(errorMessages.Any(x => x.Contains("Unexpected character encountered while parsing value: T")), "documents creation expected to fail with JSON validation error");
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

            bool success;
            string[] errorMessages = new string[0];

            try
            {
                var sessionResponse = _esfQueryRunner.RunRawQuery(mapping, documents, query).SessionResponse;
                success = true;
            }
            catch (AggregateException aggException)
            {
                var ex = aggException.InnerException as EsfInvalidStateException;
                success = false;
                errorMessages = ex.Query;
            }

            Assert.IsFalse(success);
            _esfQueryRunner.LogTestRun(String.Join(",", errorMessages));

            Assert.IsTrue(errorMessages.Any(x => x.Contains("After parsing a value an unexpected character was encountered: :")), "query run expected to fail with JSON validation error");
        }
    }
}
