using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain.Tests.Elasticsearch
{
    public class ElasticsearchErrorsInQuery : ElasticsearchTestsBase
    {
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
            Assert.IsFalse(result.QueryResponse.IsSuccess, "expected unsuccessful QueryResponse for query with invalid operator");
            EsfError queryElasticSearchError = result.QueryResponse.ElasticsearchError;
            _esfQueryRunner.LogTestRun(queryElasticSearchError);
            Assert.AreEqual(400, queryElasticSearchError.HttpStatusCode);
            Assert.AreEqual("Type: parsing_exception Reason: \"no [query] registered for [match_error]\"", queryElasticSearchError.Error);
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
            Assert.IsFalse(result.QueryResponse.IsSuccess, "Expected wrong sort criteria query to fail");
            EsfError queryElasticsearchError = result.QueryResponse.ElasticsearchError;

            _esfQueryRunner.LogTestRun(queryElasticsearchError);

            Assert.AreEqual(400, queryElasticsearchError.HttpStatusCode);
            Assert.IsTrue(queryElasticsearchError.Error.Contains("Type: search_phase_execution_exception"));
        }
    }
}
