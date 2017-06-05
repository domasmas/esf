using AutoMapper;
using Esf.DataAccess;
using Esf.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Esf.WebApi.Areas.EsfState.New
{
    [Route("states/new")]
    public class NewEsfStateController : Controller
    {
        protected readonly INewEsfStateFactory _newEsfStateFactory;
		protected readonly IMapper _mapper;

        public NewEsfStateController(INewEsfStateFactory newEsfStateFactory, IMapper mapper)
        {
            _newEsfStateFactory = newEsfStateFactory;
			_mapper = mapper;

		}

        [HttpGet()]
        public async Task<EsfStateResponseDto> Get()
        {
            EsState newState = await _newEsfStateFactory.GetNewState();
            var esfState = _mapper.Map<EsState, ExistingEsfStateDto>(newState);

            return new EsfStateResponseDto
            {
                EsfState = esfState
            };
        }
    }
}