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

        // GET: api/EsfState/5
        [HttpGet]
        [Route("")]
        public async Task<EsState> Get(string id)
        {
            return await this.stateRepository.GetEsState(id);
        }

        // POST: api/EsfState
        [HttpPost]
        [Route("")]
        public async void Post([FromBody]EsfStateDto state)
        {
            await this.stateRepository.InsertEsState(EsfStateDto.ToDomainObject(state));
        }

        // PUT: api/EsfState/5
        [HttpPut]
        [Route("")]
        public async Task<EsfStateDto> Put([FromBody]EsfStateDto newState)
        {
            var esState = EsfStateDto.ToDomainObject(newState);
            esState.Id = Guid.NewGuid().ToString();
            esState.Query += " (updated from controller) ";
            var newEsState = await this.stateRepository.InsertEsState(esState);
            return EsfStateDto.FromDomainObject(newEsState);
        }

        // DELETE: api/EsfState/5
        [HttpDelete]
        [Route("")]
        public async void Delete(string id)
        {
            await this.stateRepository.DeleteEsState(id);
        }
    }
}
