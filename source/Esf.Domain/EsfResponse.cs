using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class EsfResponse
    {
        public bool IsSuccess { get; set; }
        public string SuccessJsonResult { get; set; }
        public JsonError JsonValidationError { get; set; }
        public EsfError ElasticsearchError { get; set; }
    }
}
