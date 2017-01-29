using MongoDB.Driver;

namespace Esf.DataAccess
{
    public class EsDatabaseClient : IEsDatabaseClient
    {
        protected readonly IMongoDatabase _database;

        public EsDatabaseClient(string esFiddleConnectionString)
        {
            var mongoUrl = new MongoUrl(esFiddleConnectionString);
            var mongoClient = new MongoClient(mongoUrl);
            _database = mongoClient.GetDatabase(mongoUrl.DatabaseName);
        }

        public IMongoDatabase Database
        {
            get
            {
                return _database;
            }
        }
    }
}
