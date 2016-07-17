using System.Collections.Generic;
using System.Web.Http;

namespace Esf.WebApi.Areas.EsfState
{
    public class EsfStateController : ApiController
    {
        // GET: api/EsfState
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/EsfState/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/EsfState
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/EsfState/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/EsfState/5
        public void Delete(int id)
        {
        }
    }
}
