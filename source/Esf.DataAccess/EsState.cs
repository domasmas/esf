using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.DataAccess
{
    public class EsState
    {
        public ObjectId _id { get; set; }
        public List<string> Documents { get; set; }
        public string Mapping { get; set; }
        public string Query { get; set; }
    }
}
