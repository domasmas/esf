using System.Web.Http;
using System.Web.Http.Cors;

namespace Esf.WebApi.Areas.EsfState.New
{
    [RoutePrefix("states/new")]
    public class NewEsfStateController : ApiController
    {
        [Route("")]
        // GET: api/NewEsfState
        public NewEsfStateDto Get()
        {
            return new NewEsfStateDto
            {
                Documents = "Documents from backend updated",
                Mapping = "Mapping from BE",
                Query = "Query from BE"
            };
        }

        [Route("")]
        // POST: api/NewEsfState
        public void Post([FromBody]NewEsfStateDto value)
        {

        }
    }
}
