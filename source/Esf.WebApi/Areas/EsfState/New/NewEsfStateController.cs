using System.Web.Http;

namespace Esf.WebApi.Areas.EsfState.New
{
    [Route("state/new")]
    public class NewEsfStateController : ApiController
    {
        // GET: api/NewEsfState
        public NewEsfStateDto Get()
        {
            return new NewEsfStateDto
            {
                Documents = "Documents from backend",
                Mapping = "Mapping from BE",
                Query = "Query from BE"
            };
        }

        // POST: api/NewEsfState
        public void Post([FromBody]NewEsfStateDto value)
        {

        }
    }
}
