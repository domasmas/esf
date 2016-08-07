using System.Collections.Generic;
using Esf.DataAccess;

namespace Esf.WebApi.Areas.EsfState
{
    public class EsfStateDto
    {
        public string Id { get; set; }
        public string Mapping { get; set; }
        public List<string> Documents { get; set; }
        public string Query { get; set; }

        public static EsState ToDomainObject(EsfStateDto dto)
        {
            return new EsState
            {
                Query = dto.Query,
                Mapping = dto.Mapping,
                Documents = dto.Documents,
                Id = dto.Id
            };
        }

        public static EsfStateDto FromDomainObject(EsState domainObject)
        {
            return new EsfStateDto
            {
                Query = domainObject.Query,
                Documents = domainObject.Documents,
                Mapping = domainObject.Mapping,
                Id = domainObject.Id
            };
        }
    }
}
