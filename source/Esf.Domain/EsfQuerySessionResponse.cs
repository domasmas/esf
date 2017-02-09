using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class EsfQuerySessionResponse
    {
        public EsfCreateResourceResponse CreateMappingResponse { get; set; }
        public EsfCreateResourceResponse CreateDocumentsResponse { get; set; }
        public EsfQueryResponse QueryResponse { get; set; }
    }
}
