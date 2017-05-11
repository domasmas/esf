using AutoMapper;
using Esf.DataAccess;
using Esf.Domain;
using System;
using System.Threading.Tasks;
using System.Web.Http;

namespace Esf.WebApi.Areas.EsfState.New
{
    [RoutePrefix("states/new")]
    public class NewEsfStateController : ApiController
    {
        protected readonly INewEsfStateFactory _newEsfStateFactory;
		protected readonly IMapper _mapper;

        public NewEsfStateController(INewEsfStateFactory newEsfStateFactory, IMapper mapper)
        {
            _newEsfStateFactory = newEsfStateFactory;
			_mapper = mapper;

		}

        [Route("")]
        public async Task<EsfStateResponseDto> Get()
        {
            try
            {
                EsState newState = await _newEsfStateFactory.GetNewState();
                var esfState = _mapper.Map<EsState, ExistingEsfStateDto>(newState);

                return new EsfStateResponseDto
                {
                    EsfState = esfState,
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
    }
}