using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Esf.Domain.Tests.Elasticsearch.Tests
{
    public class ElasticsearchErrorsInQuery : ElasticsearchTestsBase
    {
        [Fact]
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

            var queryResponse = _esfQueryRunner.RunQuery(mapping, documents, query).SessionResponse.QueryResponse;
            Assert.False(queryResponse.IsSuccess, "expected unsuccessful QueryResponse for query with invalid operator");
            EsfError queryElasticSearchError = queryResponse.ElasticsearchError;
            _esfQueryRunner.LogTestRun(queryElasticSearchError);
            Assert.Equal(400, queryElasticSearchError.HttpStatusCode);
            Assert.Equal("Type: parsing_exception Reason: \"no [query] registered for [match_error]\"", queryElasticSearchError.Error);
        }

        [Fact]
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

            var queryResponse = _esfQueryRunner.RunQuery(mapping, documents, query).SessionResponse.QueryResponse;
            Assert.False(queryResponse.IsSuccess, "Expected wrong sort criteria query to fail");
            EsfError queryElasticsearchError = queryResponse.ElasticsearchError;

            _esfQueryRunner.LogTestRun(queryElasticsearchError);

            Assert.Equal(400, queryElasticsearchError.HttpStatusCode);
            Assert.True(queryElasticsearchError.Error.Contains("Type: search_phase_execution_exception"));
        }
    }
}
