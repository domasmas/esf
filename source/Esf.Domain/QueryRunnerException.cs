using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class QueryRunnerException : Exception
    {
        public QueryRunnerException(string message) : base(message) { }
    }
}
