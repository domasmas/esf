using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.DataAccess
{
    public class EsDatabaseClient
    {
        public EsDatabaseClient(string esFiddleConnectionString)
        {
            var mongoUrl = new MongoUrl(esFiddleConnectionString);
            var mongoClient = new MongoClient(mongoUrl);
            Database = mongoClient.GetDatabase(mongoUrl.DatabaseName);
        }

        private static string GetEsDatabaseConnectionString()
        {
            return ConfigurationManager.ConnectionStrings["EsFiddleDb"].ConnectionString;
        }

        public EsDatabaseClient()
            :this(EsDatabaseClient.GetEsDatabaseConnectionString())
        { }

        public IMongoDatabase Database { get; set; }
    }
}
