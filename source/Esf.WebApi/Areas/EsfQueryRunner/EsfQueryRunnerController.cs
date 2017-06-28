using AutoMapper;
using Esf.Domain;
using Esf.Domain.Validation;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Esf.WebApi.Areas.EsfQueryRunner
{
    [Route("query-runner")]
    public class EsfQueryRunnerController : Controller
    {
        protected readonly IEsfQueryRunner _queryRunner;
		protected readonly IMapper _mapper;

        public EsfQueryRunnerController(IEsfQueryRunner queryRunner, IMapper mapper)
        {
            _queryRunner = queryRunner;
			_mapper = mapper;
		}

        [HttpPost]
        public async Task<EsfRunResponseDto> Post([FromBody]EsfQueryRunnerDto esfState)
        {
            EsfQueryRunResult runResult = await _queryRunner.Run(esfState.Mapping, esfState.Documents.ToArray(), esfState.Query);
            EsfRunResponseDto mappedResult = _mapper.Map<EsfRunResponseDto>(runResult);
			return mappedResult;
        }
    }
}