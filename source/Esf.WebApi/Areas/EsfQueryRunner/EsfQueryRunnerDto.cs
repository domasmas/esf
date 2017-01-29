using System.Collections.Generic;

namespace Esf.WebApi.Areas.EsfQueryRunner
{
    public class EsfQueryRunnerDto
    {
        public string Mapping { get; set; }
        public string Query { get; set; }
        public List<string> Documents { get; set; }
    }
}