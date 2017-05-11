using System;
using System.Threading.Tasks;
using System.Web.Http;
using Esf.DataAccess;
using AutoMapper;
using Esf.Domain.Validation;
using System.Linq;

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
            try
            {
                Guid parsedStateUrl = Guid.Parse(stateUrl);
                EsState storedState = await _esStatesRepository.FindEsState((state) => state.StateUrl == parsedStateUrl);
                var newState = _mapper.Map<EsState, ExistingEsfStateDto>(storedState);

                return new EsfStateResponseDto
                {
                    EsfState = newState,
                    Success = true
                };
            }
            catch(Exception exception)
            {
                return new EsfStateResponseDto
                {
                    Error = exception.Message,
                    Success = false
                };
            }
        }
        
        [HttpPost]
        [Route("")]
        public async Task<EsfStateResponseDto> Post([FromBody]EsfStateDto state)
        {
            try
            {
                var inputErrors = _validator.GetStateErrors(state.Mapping, state.Query, state.Documents);
                if (inputErrors != null && inputErrors.Any())
                {
                    return new EsfStateResponseDto
                    {
                        Error = String.Join(Environment.NewLine, inputErrors.Select(x => x.ErrorMessage)),
                        Success = false
                    };
                }

                var newEsState = _mapper.Map<EsfStateDto, EsState>(state);
                var insertResponse = await _esStatesRepository.InsertEsState(newEsState);
                var newState = _mapper.Map<EsState, ExistingEsfStateDto>(insertResponse);

                return new EsfStateResponseDto
                {
                    EsfState = newState,
                    Success = true
                };
            }
            catch(Exception exception)
            {
                return new EsfStateResponseDto
                {
                    Error = exception.Message,
                    Success = false
                };
            }
        }
        

        // TODO: I don't think we even need this one... Looks dangerous - people can delete other people's states
        //[HttpDelete]
        //[Route("")]
        //public async void Delete(string id)
        //{
        //    await _esStatesRepository.DeleteEsState(id);
        //}
    }
}