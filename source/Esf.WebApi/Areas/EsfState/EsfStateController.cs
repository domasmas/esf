using System;
using System.Threading.Tasks;
using System.Web.Http;
using Esf.DataAccess;
using AutoMapper;
using Esf.Domain.Validation;
using System.Linq;
using Esf.WebApi.Exceptions;

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
        [Route("")]
        public async Task<EsfStateResponseDto> Post([FromBody]EsfStateDto state)
        {
            var inputErrors = _validator.GetStateErrors(state.Mapping, state.Query, state.Documents);
            if (inputErrors != null && inputErrors.Any())
            {
                throw new EsfValidationException
                {
                    ErrorMessage = String.Join(Environment.NewLine, inputErrors.Select(x => x.ErrorMessage))
                };
            }

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