using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Esf.WebApi.Areas.EsfQueryRunner
{
    public class EsfQueryRunnerResponseDto
    {
        public EsfRunResponseDto CreateMappingResponse { get; set; }
        public EsfRunResponseDto CreateDocumentsResponse { get; set; }
        public EsfRunResponseDto QueryResponse { get; set; }
    }
}