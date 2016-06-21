using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Esf.DataAccess.Tests
{
    public class DbDeploymentConfig
    {
        public string mongoDbServerDirectory { get; set; }
        public string mongoDbPath { get; set; }
        public string mongoDbLogPath { get; set; }

        public static DbDeploymentConfig Load()
        {
            string dbDeploymentConfigPath = GetDeploymentScriptPath("dbDeploymentConfig.json");
            var jsonContent = File.ReadAllText(dbDeploymentConfigPath);
            var result = JsonConvert.DeserializeObject<DbDeploymentConfig>(jsonContent);
            return result;

        }
        
        public static string GetDeploymentScriptPath(string fileName)
        {

            string projectDirectory = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            string result = Path.Combine(projectDirectory, "DeploymentScripts", fileName);
            return result;
        }
    }
}
