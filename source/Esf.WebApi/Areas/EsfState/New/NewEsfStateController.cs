﻿using Esf.DataAccess;
using Esf.Domain;
using System;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Esf.WebApi.Areas.EsfState.New
{
    [RoutePrefix("states/new")]
    public class NewEsfStateController : ApiController
    {
        [Route("")]
        public async Task<EsfStateDto> Get()
        {
            var newStateFactory = new NewEsfStateFactory();
            EsState newState = await newStateFactory.CreateState();
            var flattenedDocuments = new StringBuilder();
            foreach (string document in newState.Documents)
                flattenedDocuments.Append(string.Format("{0} ", document));

            return new EsfStateDto
            {
                Documents = newState.Documents,
                Mapping = newState.Mapping,
                Query = newState.Query
            };
        }

        [Route("")]
        public void Post([FromBody]EsfStateDto value)
        {

        }
    }
}
