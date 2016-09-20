using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.DataAccess.Tests
{
    public class UpgradeScriptAuditRecord
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public string ScriptName { get; set; }
        public string Version { get; set; }
        public string Action { get; set; }
    }
}
