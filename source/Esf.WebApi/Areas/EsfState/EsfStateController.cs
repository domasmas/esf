using System;
using System.Threading.Tasks;
using System.Web.Http;
using Esf.DataAccess;
using AutoMapper;
using Esf.Domain.Validation;

namespace Esf.WebApi.Areas.EsfState
{
    [RoutePrefix("states")]
    public class EsfStateController : ApiController
    {
        protected readonly IEsStatesRepository _esStatesRepository;
		protected readonly IMapper _mapper;
        protected readonly IEsfStateValidator _validator;

		public EsfStateController(IEsStatesRepository esStatesRepository, IMapper mapper, IEsfStateValidator validator)
        {
            _esStatesRepository = esStatesRepository;
			_mapper = mapper;
            _validator = validator;
        }
        
        [HttpGet]
        [Route("")]
        public async Task<ExistingEsfStateDto> Get(string stateUrl)
        {
            Guid parsedStateUrl = Guid.Parse(stateUrl);
            EsState storedState = await _esStatesRepository.FindEsState((state) => state.StateUrl == parsedStateUrl);
            return _mapper.Map<EsState, ExistingEsfStateDto>(storedState);
        }
        
        [HttpPost]
        [Route("")]
        public async Task<ExistingEsfStateDto> Post([FromBody]EsfStateDto state)
        {
            var newEsState = _mapper.Map<EsfStateDto, EsState>(state);
			var insertResponse = await _esStatesRepository.InsertEsState(newEsState);
			return _mapper.Map<EsState, ExistingEsfStateDto>(insertResponse);
        }
        
        [HttpDelete]
        [Route("")]
        public async void Delete(string id)
        {
            await _esStatesRepository.DeleteEsState(id);
        }
    }
}
