using Esf.DataAccess;
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
            //var newEsState = (await _statesRepository.FindEsStates(s => s.StateUrl == Guid.Empty)).FirstOrDefault();
            EsState newEsState = null;
            if (newEsState == null)
            {
                newEsState = new EsState
                {
                    Documents =  "[{\"prop1\":\"value1\"}, {\"prop1\":\"value1\"}]" ,
                    Query = "{\"prop1\":\"value1\"}",
                    Mapping = "{\"prop1\":\"value1\"}"
                };
                await _statesRepository.InsertEsState(newEsState);
            }
            return newEsState;
        }
    }
}
