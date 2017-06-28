using Esf.Domain.Helpers;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Esf.Domain.Tests.Elasticsearch
{
    public class EsfQuerySessionResponseFixture
    {
        public EsfQuerySessionResponseFixture(EsfQueryRunResult sessionResponse)
        {
            SessionResponse = sessionResponse;
        }

        public EsfQueryRunResult SessionResponse { get; private set; }

        public SuccessfulQuery GetSuccessfulQuery()
        {
            return new SuccessfulQuery(SessionResponse.Result);
        }

        public class SuccessfulQuery
        {
            private dynamic _queryJsonResult;

            public SuccessfulQuery(string queryResponse)
            {
                _queryJsonResult = JSON.Deserialize<dynamic>(queryResponse);
                if (_queryJsonResult.timed_out.Value)
                    throw new ArgumentException("queryResponse timed out!");
                Json = queryResponse;
            }

            public string Json { get; private set; }

            public int GetHitsCount()
            {
                return _queryJsonResult.hits.total;
            }

            private IEnumerable<dynamic> _hits;

            private IEnumerable<dynamic> GetHits()
            {
                if (_hits == null)
                {
                    JArray hitsJsonArray = _queryJsonResult.hits.hits;
                    _hits = hitsJsonArray.Select(hit => ((dynamic)hit));
                }
                return _hits;
            }

            public HasHitSpec HasHitWith()
            {
                IEnumerable<dynamic> hits = GetHits();
                return new HasHitSpec(hits);
            }

            public class HasHitSpec
            {
                private IEnumerable<dynamic> _hits;

                public HasHitSpec(IEnumerable<dynamic> hits)
                {
                    _hits = hits;
                }

                public HasHitSpec _index(string _index)
                {
                    _hits = _hits.Where(h => h._index == _index);
                    return this;
                }

                public HasHitSpec _type(string _type)
                {
                    _hits = _hits.Where(h => h._type == _type);
                    return this;
                }
                public HasHitSpec _id(string _id)
                {
                    _hits = _hits.Where(h => h._id == _id);
                    return this;
                }
                public HasHitSpec _score(double _score)
                {
                    _hits = _hits.Where(h => h._score == _score);
                    return this;
                }
                public HasHitSpec _source(dynamic _source)
                {
                    string serializedSource = JSON.Serialize(_source);
                    _hits = _hits.Where(h => JSON.Serialize(h._source) == serializedSource);
                    return this;
                }

                public HasHitSpec fields(dynamic fields)
                {
                    string serializedFields = JSON.Serialize(fields);
                    _hits = _hits.Where(h => JSON.Serialize(h.fields) == serializedFields);
                    return this;
                }

                public HasHitSpec sort(dynamic[] sort)
                {
                    string serializedSort = JSON.Serialize(sort);
                    _hits = _hits.Where(h => JSON.Serialize(h.sort) == serializedSort);
                    return this;
                }

                public HasHitSpec Explanation()
                {
                    _hits = _hits.Where(h => h._explanation != null);
                    return this;
                }

                /// <summary>
                /// Position at the hits array starting from 0.
                /// </summary>
                /// <param name="position">Position at the hits array starting from 0</param>
                /// <returns></returns>
                public HasHitSpec PositionAt(int position)
                {
                    _hits = new List<dynamic>() { _hits.ElementAt(position) };
                    return this;
                }

                public bool Build()
                {
                    return _hits.Any();
                }
            }

            public bool HasAggregations(dynamic expectedAggregations)
            {
                string serializedActual = JSON.Serialize(_queryJsonResult.aggregations);
                string serializedExpected = JSON.Serialize(expectedAggregations);
                return serializedActual == serializedExpected;
            }
        }
    }
}
