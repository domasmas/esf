using Elasticsearch.Net;
using Esf.Domain.Helpers;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain.Tests
{
    [TestFixture]
    public class Elasticsearch
    {
        [SetUp]
        public static void Initialize()
        {
            var uri = new Uri("http://localhost:9200");
            _esfQueryRunner = new ElasticsearchFixture(uri);
        }

        private static ElasticsearchFixture _esfQueryRunner;

        [Test]
        public void InvalidMapppingJson()
        {
            var mapping = @"{""properties"": {""message"": {""type"": ""string""}, ""something"": {""}}}";
            var documents = new string[] {};
            var query = "";

            var resultDocuments = _esfQueryRunner.RunQueryRaw(mapping, documents, query);
            Console.WriteLine(resultDocuments);
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

            var resultDocuments = _esfQueryRunner.RunQueryRaw(mapping, documents, query);
            Console.WriteLine(resultDocuments);
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

            var queryResult = _esfQueryRunner.RunQueryRaw(mapping, documents, query);
            Console.WriteLine(queryResult);
        }

        [Test]
        public void MatchQueryWithSingleMatch()
        {
            var mapping = new
            {
                properties = new
                {
                    message = new { type = "string", store = true }
                }
            };

            var documents = new[] { new {
                message = "The quick brown fox jumps over the lazy dog"
            } };

            var query = new
            {
                query = new
                {
                    match = new { message = "fox" }
                }
            };

            var result = _esfQueryRunner.RunQuery(mapping, documents, query);
            Console.WriteLine(result.QueryResponse.IsSuccess);
            Console.WriteLine(result);
        }

        [Test]
        public void ErrorInQuery()
        {
            var mapping = new { };

            var documents = new[] { new {
                message = "content in here"
            } };

            var query = new
            {
                query = new
                {
                    match_error = new
                    {
                        message = "content"
                    }
                }
            };

            var result = _esfQueryRunner.RunQuery(mapping, documents, query);
            Console.WriteLine(result.QueryResponse.IsSuccess);
            Console.WriteLine(JSON.Serialize(result.QueryResponse.ElasticsearchError));
        }

        [Test]
        public void Sort()
        {
            var mapping = new
            {
                properties = new
                {
                    post_date = new { type = "date" },
                    name = new { type = "string" },
                    age = new { type = "integer" }
                }
            };

            var documents = new[] { new {
                post_date = new DateTime(2010, 5, 5),
                name = "Barbara",
                age = 22
            },
            new {
                post_date = new DateTime(2015, 5,5),
                name = "John",
                age = 33
            }};


            dynamic query = new
            {
                sort = new dynamic[] {
                    new { post_date = new { order = "desc"}},
                    new { age = new { order = "asc" } },
                    "_score"
                },
                query = new
                {
                    match_all = new { }
                }
            };

            EsfQuerySessionResponse result = _esfQueryRunner.RunQuery(mapping, documents, query);
            Console.WriteLine(result.QueryResponse.IsSuccess);
            Console.WriteLine(result.QueryResponse.SuccessJsonResult);
        }

        [Test]
        public void WrongSortCriteria()
        {
            var mapping = new
            {
                properties = new
                {
                    post_date = new { type = "date" },
                    name = new { type = "string" },
                    age = new { type = "integer" }
                }
            };

            var documents = new[] { new {
                post_date = new DateTime(2010, 5, 5),
                name = "Barbara",
                age = 22
            },
            new {
                post_date = new DateTime(2015, 5,5),
                name = "John",
                age = 33
            }};


            dynamic query = new
            {
                sort = new dynamic[] {
                    new { post_date = new { order = "desc"}},
                    new { age = new { order = "asc" } },
                    "name",
                    "_score"
                },
                query = new
                {
                    match_all = new { }
                }
            };

            EsfQuerySessionResponse result = _esfQueryRunner.RunQuery(mapping, documents, query);
            Console.WriteLine(result.QueryResponse.IsSuccess);
            Console.WriteLine(result.QueryResponse.ElasticsearchError);
        }

        [Test]
        public void Aggregation()
        {
            var mapping = new
            {
                properties = new
                {
                    name = new { type = "string" },
                    age = new { type = "integer" }
                }
            };

            var documents = new[] { new {
                name = "Barbara",
                age = 22
            },
            new {
                name = "John",
                age = 33
            }};


            dynamic query = new
            {
                query = new
                {
                    match_all = new { }
                },
                aggregations = new
                {
                    avg_age = new
                    {
                        avg = new { field = "age" }
                    }
                }
            };

            EsfQuerySessionResponse result = _esfQueryRunner.RunQuery(mapping, documents, query);
            Console.WriteLine(result.QueryResponse.IsSuccess);
            Console.WriteLine(result.QueryResponse.SuccessJsonResult);
        }
    }
}
