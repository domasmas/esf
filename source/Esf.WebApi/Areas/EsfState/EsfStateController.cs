using System;
using System.Threading.Tasks;
using System.Web.Http;
using Esf.DataAccess;

namespace Esf.WebApi.Areas.EsfState
{
    [RoutePrefix("states")]
    public class EsfStateController : ApiController
    {
        private readonly EsStatesRepository stateRepository;

        public EsfStateController()
        {
            var databaseClient = new EsDatabaseClient();
            this.stateRepository = new EsStatesRepository(databaseClient.Database);
        }
        
        [HttpGet]
        [Route("")]
        public async Task<ExistingEsfStateDto> Get(string stateUrl)
        {
            Guid parsedStateUrl = Guid.Parse(stateUrl);
            EsState storedState = await this.stateRepository.FindEsState((state) => state.StateUrl == parsedStateUrl);
            return EsfStateConverter.From(storedState);
        }
        
        [HttpPost]
        [Route("")]
        public async Task<ExistingEsfStateDto> Post([FromBody]EsfStateDto state)
        {
            var newEsState = EsfStateConverter.FromNew(state);
            return EsfStateConverter.From(await this.stateRepository.InsertEsState(newEsState));
        }
        
        [HttpDelete]
        [Route("")]
        public async void Delete(string id)
        {
            await this.stateRepository.DeleteEsState(id);
        }
    }
}
