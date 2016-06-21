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
        private IMongoDatabase _database;

        public EsStatesRepository(IMongoDatabase database)
        {
            _database = database;
        }

        private IMongoCollection<EsState> EsStatesCollection
        {
            get
            {
                return _database.GetCollection<EsState>("esStates");
            }
        }
        
        public async Task<EsState> GetEsState(string id)
        {
            var esFilter = Builders<EsState>.Filter;
            return await EsStatesCollection.Find(esFilter.Eq((esState) => esState.Id, id)).FirstOrDefaultAsync();
        }

        public async Task<EsState> InsertEsState(EsState state)
        {
            await EsStatesCollection.InsertOneAsync(state);
            return state;
        }
    }
}
