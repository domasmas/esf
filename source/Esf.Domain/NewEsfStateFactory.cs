using Esf.DataAccess;
using System;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class NewEsfStateFactory : INewEsfStateFactory
    {
        protected readonly IEsStatesRepository _statesRepository;

        public NewEsfStateFactory(IEsStatesRepository statesRepository)
        {
            _statesRepository = statesRepository;
        }

        public async Task<EsState> GetNewState()
        {
            return await _statesRepository.FindEsState((state) => state.StateUrl == Guid.Empty);
        }
    }
}