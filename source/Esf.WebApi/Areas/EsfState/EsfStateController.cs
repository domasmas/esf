using System;
using System.Threading.Tasks;
using System.Web.Http;
using Esf.DataAccess;

namespace Esf.WebApi.Areas.EsfState
{
    [RoutePrefix("states")]
    public class EsfStateController : ApiController
    {
        protected readonly IEsStatesRepository _esStatesRepository;

        public EsfStateController(IEsStatesRepository esStatesRepository)
        {
            _esStatesRepository = esStatesRepository;
        }
        
        [HttpGet]
        [Route("")]
        public async Task<ExistingEsfStateDto> Get(string stateUrl)
        {
            Guid parsedStateUrl = Guid.Parse(stateUrl);
            EsState storedState = await _esStatesRepository.FindEsState((state) => state.StateUrl == parsedStateUrl);
            return EsfStateConverter.From(storedState);
        }
        
        [HttpPost]
        [Route("")]
        public async Task<ExistingEsfStateDto> Post([FromBody]EsfStateDto state)
        {
            var newEsState = EsfStateConverter.FromNew(state);
            return EsfStateConverter.From(await _esStatesRepository.InsertEsState(newEsState));
        }
        
        [HttpDelete]
        [Route("")]
        public async void Delete(string id)
        {
            await _esStatesRepository.DeleteEsState(id);
        }
    }
}
