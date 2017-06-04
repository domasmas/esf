using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Esf.Domain.Tests.Elasticsearch.Tests
{
    public class ElasticsearchQuery : ElasticsearchTestsBase
    {
        [Fact]
        public void QuerySingleMatch()
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

            var successfulQuery = _esfQueryRunner.RunQuery(mapping, documents, query).GetSuccessfulQuery();
            _esfQueryRunner.LogTestRun(successfulQuery.Json);   
                     
            Assert.Equal(1, successfulQuery.GetHitsCount());

            Assert.True(successfulQuery
                .HasHitWith()
                ._source(documents[0])
                .Build());
        }

        [Fact]
        public void QueryNoMatch()
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
                    match = new { message = "doesn't exist" }
                }
            };

            var successfulQuery = _esfQueryRunner.RunQuery(mapping, documents, query).GetSuccessfulQuery();
            _esfQueryRunner.LogTestRun(successfulQuery.Json);

            Assert.Equal(0, successfulQuery.GetHitsCount());
        }

        [Fact]
        public void QueryExplainApi()
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
                },
                explain = true
            };
            
            var successfulQuery = _esfQueryRunner.RunQuery(mapping, documents, query).GetSuccessfulQuery();
            _esfQueryRunner.LogTestRun(successfulQuery.Json);

            Assert.Equal(1, successfulQuery.GetHitsCount());
            Assert.True(successfulQuery.HasHitWith()
                                         .Explanation()
                                         .Build());
        }

        [Fact]
        public void QueryMatchAll()
        {
            var mapping = new
            {
                properties = new
                {
                    message = new { type = "string" }
                }
            };

            var documents = new[] { new {
                message = "The quick brown fox jumps over the lazy dog"
            },
            new {
                message = "dogs are better than frogs"
            },
            new {
                message = "non-animal message"
            }};

            var query = new
            {
                query = new
                {
                    match_all = new { }
                }
            };
            
            var successfulQuery = _esfQueryRunner.RunQuery(mapping, documents, query).GetSuccessfulQuery();
            _esfQueryRunner.LogTestRun(successfulQuery.Json);

            Assert.Equal(4, successfulQuery.GetHitsCount());

            Assert.True(successfulQuery
                .HasHitWith()
                ._source(documents[0])
                .Build());
            Assert.True(successfulQuery
                .HasHitWith()
                ._source(documents[1])
                .Build());
            Assert.True(successfulQuery
                .HasHitWith()
                ._source(documents[2])
                .Build());
        }

        [Fact]
        public void QueryNestedDocuments()
        {
            var mapping = new
            {
                properties = new
                {
                    user = new { type = "nested" }
                }
            };

            var documents = new[] {
                new {
                        group = "fans",
                        user = new[]
                        {
                            new
                            {
                                first = "John",
                                last = "Smith"
                            },
                            new
                            {
                                first = "Alice",
                                last = "White"
                            }
                        }
                    }
            };

            dynamic query = new
            {
                query = new Dictionary<string, object>
                {
                    { "bool", new
                        {
                            must = new []
                            {
                                new {
                                        match = new Dictionary<string, object>
                                        {
                                            { "user.first", "Alice" }
                                        }
                                    },
                                new {
                                        match = new Dictionary<string, object>
                                        {
                                            { "user.last", "White" }
                                        }
                                    }
                            }
                        }
                    }
                }
            };
            var successfulQuery = _esfQueryRunner.RunQuery(mapping, documents, query).GetSuccessfulQuery();
            _esfQueryRunner.LogTestRun(successfulQuery.Json);

            dynamic expectedNestedSource = new
            {
                group = "fans",
                user = new[]
                {
                    new { first = "John", last = "Smith" },
                    new { first = "Alice", last = "White" }
                }
            };
            
            Assert.Equal(1, successfulQuery.GetHitsCount());
            Assert.True(successfulQuery.HasHitWith()
                                         ._source(expectedNestedSource)
                                         .Build());
        }

        [Fact]
        public void ScriptFields()
        {
            var mapping = new
            {
                properties = new
                {
                    intValue = new { type = "number" }
                }
            };

            var documents = new[] { new {
                intValue = 1
            },
            new {
                intValue = 2
            },
            new {
                intValue = 3
            }};

            var query = new
            {
                query = new
                {
                    match_all = new { }
                },
                script_fields = new
                {
                    calculation = new
                    {
                        script = "doc['intValue'].value * 10"
                    }
                }
            };

            var successfulQuery = _esfQueryRunner.RunQuery(mapping, documents, query).GetSuccessfulQuery();
            _esfQueryRunner.LogTestRun(successfulQuery.Json);

            Assert.Equal(4, successfulQuery.GetHitsCount());

            dynamic expectedFields1 = new { calculation = new[] { 10 } };
            Assert.True(successfulQuery.HasHitWith()
                                         ._id("1")
                                         .fields(expectedFields1)
                                         .Build());

            dynamic expectedFields2 = new { calculation = new[] { 20 } };
            Assert.True(successfulQuery.HasHitWith()
                                         ._id("2")
                                         .fields(expectedFields2)
                                         .Build());

            dynamic expectedFields3 = new { calculation = new[] { 30 } };
            Assert.True(successfulQuery.HasHitWith()
                                         ._id("3")
                                         .fields(expectedFields3)
                                         .Build());
        }


        [Fact]
        public void QueryTerm()
        {
            var mapping = new
            {
                properties = new
                {
                    message = new { type = "string" }
                }
            };

            var documents = new[] { new {
                message = "The quick brown fox jumps over the lazy dog"
            },
            new {
                message = "dogs are better than frogs"
            },
            new {
                message = "better non-animal message"
            }};

            var query = new
            {
                query = new
                {
                    term = new { message = "better" }
                }
            };

            var successfulQuery = _esfQueryRunner.RunQuery(mapping, documents, query).GetSuccessfulQuery();
            _esfQueryRunner.LogTestRun(successfulQuery.Json);

            Assert.Equal(2, successfulQuery.GetHitsCount());
            
            Assert.True(successfulQuery.HasHitWith()
                                         ._id("3")
                                         ._source(documents[2])
                                         .Build());

            Assert.True(successfulQuery.HasHitWith()
                             ._id("2")
                             ._source(documents[1])
                             .Build());
        }

        [Fact]
        public void QueryRange()
        {
            var mapping = new
            {
                properties = new
                {
                    age = new { type = "number" }
                }
            };

            var documents = new[]
            {
                new { age = 22},
                new { age = 50},
                new { age = 15},
                new { age = 100},
                new { age = 33}
            };

            var query = new
            {
                query = new
                {
                    range = new
                    {
                        age = new
                        {
                            gte = 20,
                            lte = 50
                        }
                    }
                }
            };

            var successfulQuery = _esfQueryRunner.RunQuery(mapping, documents, query).GetSuccessfulQuery();
            _esfQueryRunner.LogTestRun(successfulQuery.Json);

            Assert.Equal(3, successfulQuery.GetHitsCount());

            Assert.True(successfulQuery.HasHitWith()
                                         ._source(new { age = 22 })
                                         .Build());
            Assert.True(successfulQuery.HasHitWith()
                             ._source(new { age = 33 })
                             .Build());

            Assert.True(successfulQuery.HasHitWith()
                             ._source(new { age = 50 })
                             .Build());
        }

        [Fact]
        public void QueryRegex()
        {
            var mapping = new
            {
                properties = new
                {
                    message = new { type = "keyword" }
                }
            };

            var documents = new[] { new {
                message = "Animal: the quick brown fox jumps over the lazy dog"
            },
            new {
                message = "good spirit"
            },
            new {
                message = "Animal: dogs are better than frogs"
            },
            new {
                message = "better non-animal message"
            }};

            var query = new
            {
                query = new
                {
                    regexp = new { message = "anim.*" }
                }
            };

            var successfulQuery = _esfQueryRunner.RunQuery(mapping, documents, query).GetSuccessfulQuery();
            _esfQueryRunner.LogTestRun(successfulQuery.Json);

            Assert.Equal(3, successfulQuery.GetHitsCount());

            Assert.True(successfulQuery.HasHitWith()
                                         ._source(documents[0])
                                         .Build());
            Assert.True(successfulQuery.HasHitWith()
                             ._source(documents[2])
                             .Build());

            Assert.True(successfulQuery.HasHitWith()
                             ._source(documents[3])
                             .Build());
        }
        
        [Fact]
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

            var successfulQuery = _esfQueryRunner.RunQuery(mapping, documents, query).GetSuccessfulQuery();
            _esfQueryRunner.LogTestRun(successfulQuery.Json);

            Assert.Equal(3, successfulQuery.GetHitsCount());
            
            Assert.True(successfulQuery
                .HasHitWith()
                .PositionAt(0)
                .sort(new dynamic[] { 1430784000000, 33, 1.0 })
                ._source(documents[1])
                .Build());

            Assert.True(successfulQuery
                .HasHitWith()
                .PositionAt(1)
                .sort(new dynamic[] { 1273017600000, 22, 1.0 })
                ._source(documents[0])
                .Build());
        }

        [Fact]
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

            var successfulQuery = _esfQueryRunner.RunQuery(mapping, documents, query).GetSuccessfulQuery();
            _esfQueryRunner.LogTestRun(successfulQuery.Json);

            dynamic expectedAggregations = new Dictionary<string, object>
            {
                { "avg_age", new { value = 27.5 } }
            };
            Assert.True(successfulQuery.HasAggregations(expectedAggregations));
        }
    }
}
