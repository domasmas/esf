using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using System;

namespace Esf.DataAccess
{
    public class EsState
    {
        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        public string Id { get; set; }
        public Guid StateUrl { get; set; }
        public string Documents { get; set; }
        public string Mapping { get; set; }
        public string Query { get; set; }
    }
}
