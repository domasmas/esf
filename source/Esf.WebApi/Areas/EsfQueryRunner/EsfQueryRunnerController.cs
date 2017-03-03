using Esf.Domain;
using System.Threading.Tasks;
using System.Web.Http;

namespace Esf.WebApi.Areas.EsfQueryRunner
{
    [RoutePrefix("query-runner")]
    public class EsfQueryRunnerController : ApiController
    {
        protected readonly IEsfQueryRunner _queryRunner;

        public EsfQueryRunnerController(IEsfQueryRunner queryRunner)
        {
            _queryRunner = queryRunner;
        }

        [HttpPost]
        [Route("")]
        public async Task<EsfQueryRunnerResponseDto> Post([FromBody]EsfQueryRunnerDto esfState)
        {
            EsfQuerySessionResponse runResult = await _queryRunner.Run(esfState.Mapping, esfState.Documents.ToArray(), esfState.Query);
            return EsfQueryRunnerResponseMapper.Map(runResult);
        }
    }
}