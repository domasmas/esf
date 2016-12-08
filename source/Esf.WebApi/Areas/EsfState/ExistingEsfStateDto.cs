using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Esf.WebApi.Areas.EsfState
{
    public class ExistingEsfStateDto
    {
        public EsfStateDto State { get; set; }
        public string StateUrl { get; set; }
    }
}