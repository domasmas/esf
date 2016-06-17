using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.DataAccess.Tests
{
    public class DbDeploymentConfig
    {
        public string mongoDbServerDirectory { get; set; }
        public string mongoDbPath { get; set; }
        public string mongoDbLogPath { get; set; }
    }
}
