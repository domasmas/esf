using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.DataAccess
{
    public class EsState
    {
        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        public string Id { get; set; }
        public Guid StateUrl { get; set; }
        public List<string> Documents { get; set; }
        public string Mapping { get; set; }
        public string Query { get; set; }
    }
}
