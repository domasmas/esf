using AutoMapper;
using Esf.Domain;
using Esf.Domain.Validation;
using System.Threading.Tasks;
using System.Web.Http;

namespace Esf.WebApi.Areas.EsfQueryRunner
{
    [RoutePrefix("query-runner")]
    public class EsfQueryRunnerController : ApiController
    {
        protected readonly IEsfQueryRunner _queryRunner;
		protected readonly IMapper _mapper;
        protected readonly IEsfStateValidator _validator;

        public EsfQueryRunnerController(IEsfQueryRunner queryRunner, IMapper mapper, IEsfStateValidator validator)
        {
            _queryRunner = queryRunner;
			_mapper = mapper;
            _validator = validator;
		}

        [HttpPost]
        [Route("")]
        public async Task<EsfQueryRunnerResponseDto> Post([FromBody]EsfQueryRunnerDto esfState)
        {
            EsfQuerySessionResponse runResult = await _queryRunner.Run(esfState.Mapping, esfState.Documents.ToArray(), esfState.Query);
			EsfQueryRunnerResponseDto mappedResult = _mapper.Map<EsfQueryRunnerResponseDto>(runResult);

			return mappedResult;
        }
    }
}