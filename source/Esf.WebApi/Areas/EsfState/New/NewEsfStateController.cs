using Esf.DataAccess;
using Esf.Domain;
using System.Threading.Tasks;
using System.Web.Http;

namespace Esf.WebApi.Areas.EsfState.New
{
    [RoutePrefix("states/new")]
    public class NewEsfStateController : ApiController
    {
        protected readonly INewEsfStateFactory _newEsfStateFactory;

        public NewEsfStateController(INewEsfStateFactory newEsfStateFactory)
        {
            _newEsfStateFactory = newEsfStateFactory;
        }

        [Route("")]
        public async Task<ExistingEsfStateDto> Get()
        { 
            EsState newState = await _newEsfStateFactory.GetNewState();
            return EsfStateConverter.From(newState);
        }
    }
}