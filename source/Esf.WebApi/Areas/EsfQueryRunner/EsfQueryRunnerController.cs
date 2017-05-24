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
        public async Task<EsfRunResponseDto> Post([FromBody]EsfQueryRunnerDto esfState)
        {
            EsfQueryRunResult runResult = await _queryRunner.Run(esfState.Mapping, esfState.Documents.ToArray(), esfState.Query);
            EsfRunResponseDto mappedResult = _mapper.Map<EsfRunResponseDto>(runResult);
			return mappedResult;
        }
    }
}