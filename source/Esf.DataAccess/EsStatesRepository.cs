﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using System.Linq.Expressions;

namespace Esf.DataAccess
{
    public class EsStatesRepository : IEsStatesRepository
    {
        private IEsDatabaseClient _databaseClient;

        public EsStatesRepository(IEsDatabaseClient databaseClient)
        {
            _databaseClient = databaseClient;
        }

        private IMongoCollection<EsState> EsStatesCollection
        {
            get
            {
                return _databaseClient.Database.GetCollection<EsState>("esStates");
            }
        }
        
        public async Task<EsState> GetEsState(string id)
        {
            Expression<Func<EsState, bool>> filter = (esState) => esState.Id == id;
            return await EsStatesCollection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<IList<EsState>> FindEsStates(Expression<Func<EsState, bool>> filter)
        {
            return await EsStatesCollection.Find(filter).ToListAsync();
        }

        public async Task<EsState> FindEsState(Expression<Func<EsState, bool>> filter)
        {
            return await EsStatesCollection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<EsState> InsertEsState(EsState state)
        {
            await EsStatesCollection.InsertOneAsync(state);
            return state;
        }

        public async Task<bool> DeleteEsState(string id)
        {
            DeleteResult deleteResult = await EsStatesCollection.DeleteOneAsync<EsState>((esState) => esState.Id == id);
            return deleteResult.IsAcknowledged;
        }
    }
}
