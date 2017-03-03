using Esf.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Esf.WebApi.Areas.EsfQueryRunner
{
    public class EsfQueryRunnerResponseMapper
    {
        public static EsfQueryRunnerResponseDto Map(EsfQuerySessionResponse querySessionResponse)
        {
            return new EsfQueryRunnerResponseDto()
            {
                CreateDocumentsResponse = MapRunResponse(querySessionResponse.CreateDocumentsResponse),
                CreateMappingResponse = MapRunResponse(querySessionResponse.CreateMappingResponse),
                QueryResponse = MapRunResponse(querySessionResponse.QueryResponse)
            };
        }

        private static EsfRunResponseDto MapRunResponse(EsfResponse esfResponse)
        {
            return new EsfRunResponseDto()
            {
                IsSuccess = esfResponse.IsSuccess,
                SuccessJsonResult = esfResponse.SuccessJsonResult,
                ElasticsearchError = MapElasticserachError(esfResponse.ElasticsearchError),
                JsonValidationError = MapJsonError(esfResponse.JsonValidationError)
            };
        }

        private static EsfErrorDto MapElasticserachError(EsfError error)
        {
            if (error == null)
                return null;
            return new EsfErrorDto()
            {
                HttpStatusCode = error.HttpStatusCode,
                Error = error.Error
            };
        }

        private static JsonErrorDto MapJsonError(JsonError error)
        {
            if (error == null)
                return null;
            return new JsonErrorDto()
            {
                SourceJson = error.SourceJson,
                Error = error.Error
            };
        }
    }
}