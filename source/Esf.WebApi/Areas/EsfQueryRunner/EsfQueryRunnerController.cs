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
        public async Task<string> Post([FromBody]EsfQueryRunnerDto esfState)
        {
            var runResult = await _queryRunner.Run(esfState.Mapping, esfState.Documents.ToArray(), esfState.Query);
            return runResult.QueryResponse.SuccessJsonResult;
        }
    }
}