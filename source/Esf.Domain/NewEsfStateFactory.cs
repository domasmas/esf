using Esf.DataAccess;
using System;
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

        public async Task<EsState> GetNewState()
        {
            return await _statesRepository.FindEsState((state) => state.StateUrl == Guid.Empty);
        }
    }
}
