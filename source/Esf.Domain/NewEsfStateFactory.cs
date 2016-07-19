using Esf.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class NewEsfStateFactory
    {
        private EsStatesRepository _statesRepository;

        public NewEsfStateFactory()
        {
            var databaseClient = new EsDatabaseClient();
            _statesRepository = new EsStatesRepository(databaseClient.Database);
        }

        public async Task<EsState> CreateState()
        {
            var newEsState = (await _statesRepository.FindEsStates(s => s.StateUrl == Guid.Empty)).FirstOrDefault();
            if (newEsState == null)
            {
                newEsState = new EsState()
                {
                    Documents = new List<string>() { "Doc1", "Doc2" },
                    Query = "New Query",
                    Mapping = "Mapping"                
                };
                await _statesRepository.InsertEsState(newEsState);
            }
            return newEsState;
        }
    }
}
