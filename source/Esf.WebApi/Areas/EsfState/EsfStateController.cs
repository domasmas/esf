using System;
using System.Threading.Tasks;
using Esf.DataAccess;
using AutoMapper;
using Esf.Domain.Validation;
using Microsoft.AspNetCore.Mvc;

namespace Esf.WebApi.Areas.EsfState
{
    [Route("states")]
    public class EsfStateController : Controller
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
        public async Task<EsfStateResponseDto> Get(string stateUrl)
        {
            Guid parsedStateUrl = Guid.Parse(stateUrl);
            EsState storedState = await _esStatesRepository.FindEsState((state) => state.StateUrl == parsedStateUrl);
            var newState = _mapper.Map<EsState, ExistingEsfStateDto>(storedState);

            return new EsfStateResponseDto
            {
                EsfState = newState
            };
        }
        
        [HttpPost]
        public async Task<EsfStateResponseDto> Post([FromBody]EsfStateDto state)
        {
            _validator.Validate(state.Mapping, state.Query, state.Documents);

            var newEsState = _mapper.Map<EsfStateDto, EsState>(state);
            var insertResponse = await _esStatesRepository.InsertEsState(newEsState);
            var newState = _mapper.Map<EsState, ExistingEsfStateDto>(insertResponse);

            return new EsfStateResponseDto
            {
                EsfState = newState
            };
        }
    }
}