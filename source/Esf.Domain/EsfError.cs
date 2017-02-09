using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class EsfError
    {
        public int HttpStatusCode { get; set; }
        public string Error { get; set; }
    }
}
