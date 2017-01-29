using Esf.DataAccess;
using System;

namespace Esf.WebApi.Areas.EsfState
{
    public class EsfStateConverter
    {
        public static ExistingEsfStateDto From(EsState esState)
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

        public static EsState FromNew(EsfStateDto esfStateDto)
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