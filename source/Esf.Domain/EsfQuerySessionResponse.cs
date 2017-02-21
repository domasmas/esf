using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class EsfQuerySessionResponse
    {
        public EsfResponse CreateMappingResponse { get; set; }
        public EsfResponse CreateDocumentsResponse { get; set; }
        public EsfResponse QueryResponse { get; set; }
    }
}
