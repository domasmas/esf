using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Esf.DataAccess
{
    public class EsStatesRepository
    {
        private IMongoClient _client;
        private IMongoDatabase _database;
        private const string CollectionName = "esStates";

        public EsStatesRepository()
        {
            _client = new MongoClient();
            const string databaseName = "esFiddle";
            _database = _client.GetDatabase(databaseName);
        }

        public async Task<IList<EsState>> GetEsStatesCollection()
        {
            var collection = _database.GetCollection<EsState>(CollectionName);
            IList<EsState> result = new List<EsState>();
            var filter = new BsonDocument();
            using (var cursor = await collection.FindAsync<EsState>(filter))
            {
                while (await cursor.MoveNextAsync())
                {
                    var batch = cursor.Current;
                    foreach (var document in batch)
                    {
                        result.Add(document);
                    }
                }
            };
            return result;
        }

        public async Task InsertEsState(EsState state)
        {
            var esStatesCollection = _database.GetCollection<EsState>("esStates");
            state._id = ObjectId.GenerateNewId();
            await esStatesCollection.InsertOneAsync(state);
        }

        public async Task InsertSampleDate()
        {
            var bsonDocument = new BsonDocument
            {
                { "street", "2 Avenue" },
                { "zipcode", "10075" },
                { "building", "1480" },
                { "coord", new BsonArray { 73.9557413, 40.7720266 } }
            };
            var statesCollection = _database.GetCollection<BsonDocument>("states");
            await statesCollection.InsertOneAsync(bsonDocument);
        }

        public async Task ReadSampleDate()
        {
            var collection = _database.GetCollection<BsonDocument>(CollectionName);
            var filter = new BsonDocument();
            var count = 0;
            using (var cursor = await collection.FindAsync(filter))
            {
                while (await cursor.MoveNextAsync())
                {
                    var batch = cursor.Current;
                    foreach (var document in batch)
                    {
                        // process document
                        Console.WriteLine(document.ToJson());
                        count++;
                    }
                    Console.WriteLine(string.Format("documents read: {0}", count));
                }
            }
        }
    }
}
