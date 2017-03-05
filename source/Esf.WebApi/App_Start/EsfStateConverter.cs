using Esf.DataAccess;
using Esf.WebApi.Areas.EsfState;
using System;

namespace Esf.WebApi.App_Start
{
    public class EsfStateConverter
    {
        public static ExistingEsfStateDto FromExisting(EsState esState)
        {
            return new ExistingEsfStateDto()
            {
                StateUrl = esState.StateUrl.ToString(),
                State = new EsfStateDto()
                {
                    Documents = esState.Documents,
                    Mapping = esState.Mapping,
                    Query = esState.Query
                }
            };
        }

        public static EsState ToNew(EsfStateDto esfStateDto)
        {
            return new EsState()
            {
                Documents = esfStateDto.Documents,
                StateUrl = Guid.NewGuid(),
                Mapping = esfStateDto.Mapping,
                Query = esfStateDto.Query
            };
        }
    }
}