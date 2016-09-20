using Esf.DataAccess;
using Esf.Domain.Helpers;

namespace Esf.WebApi.Areas.EsfState
{
    public class EsfStateDto
    {
        public string Id { get; set; }
        public string Mapping { get; set; }
        public string Documents { get; set; }
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
                Documents = JSON.Serialize(domainObject.Documents),
                Mapping = domainObject.Mapping,
                Id = domainObject.Id
            };
        }
    }
}
