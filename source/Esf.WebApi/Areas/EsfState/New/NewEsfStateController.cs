using Esf.DataAccess;
using Esf.Domain;
using System.Threading.Tasks;
using System.Web.Http;

namespace Esf.WebApi.Areas.EsfState.New
{
    [RoutePrefix("states/new")]
    public class NewEsfStateController : ApiController
    {
        [Route("")]
        public async Task<ExistingEsfStateDto> Get()
        {
            var newStateFactory = new NewEsfStateFactory();
            EsState newState = await newStateFactory.GetNewState();
            return EsfStateConverter.From(newState);
        }

    }
}
