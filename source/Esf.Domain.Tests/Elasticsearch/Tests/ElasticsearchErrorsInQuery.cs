using Esf.Domain.Exceptions;
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

            bool success;
            string errorMessage = string.Empty;

            try
            {
                var queryResult = _esfQueryRunner.RunQuery(mapping, documents, query).SessionResponse.Result;
                success = true;
            }
            catch(AggregateException aggException)
            {
                var ex = aggException.InnerException as EsfElasticSearchException;
                success = false;
                errorMessage = ex.ErrorMessage;
            }

            Assert.False(success, "expected unsuccessful QueryResponse for query with invalid operator");
            _esfQueryRunner.LogTestRun(errorMessage);
            Assert.Equal("Type: parsing_exception Reason: \"no [query] registered for [match_error]\"", errorMessage);
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

            bool success;
            string errorMessage = String.Empty;

            try
            {
                var queryResponse = _esfQueryRunner.RunQuery(mapping, documents, query).SessionResponse.QueryResponse;
                success = true;
            }
            catch (AggregateException aggException)
            {
                var ex = aggException.InnerException as EsfElasticSearchException;
                success = false;
                errorMessage = ex.ErrorMessage;
            }

            Assert.False(success, "Expected wrong sort criteria query to fail");
            _esfQueryRunner.LogTestRun(errorMessage);
            Assert.Contains("Type: search_phase_execution_exception", errorMessage);
        }
    }
}
