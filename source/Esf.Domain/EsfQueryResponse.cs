using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class EsfQueryResponse
    {
        public bool IsSuccess { get; set; }
        public string SuccessJsonResult { get; set; }
        public EsfError ElasticsearchError { get; set; }
    }
}
