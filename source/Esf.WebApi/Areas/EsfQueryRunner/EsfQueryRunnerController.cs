using AutoMapper;
using Esf.Domain;
using System.Threading.Tasks;
using System.Web.Http;

namespace Esf.WebApi.Areas.EsfQueryRunner
{
    [RoutePrefix("query-runner")]
    public class EsfQueryRunnerController : ApiController
    {
        protected readonly IEsfQueryRunner _queryRunner;
		protected readonly IMapper _mapper;

        public EsfQueryRunnerController(IEsfQueryRunner queryRunner, IMapper mapper)
        {
            _queryRunner = queryRunner;
			_mapper = mapper;
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