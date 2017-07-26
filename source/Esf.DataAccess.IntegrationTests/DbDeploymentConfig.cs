using Newtonsoft.Json;
using System;
using System.IO;
using System.Reflection;

namespace Esf.DataAccess.IntegrationTests
{
    public class DbDeploymentConfig
    {
        public string mongoDbServerDirectory { get; set; }
        public string esFiddleDbPath { get; set; }
        public EsfConnectionStrings ConnectionStrings { get; set; }

        public static DbDeploymentConfig Load()
        {
            string dbDeploymentConfigPath = GetDeploymentScriptPath("dbDeployment.config.json");
            var jsonContent = File.ReadAllText(dbDeploymentConfigPath);
            var result = JsonConvert.DeserializeObject<DbDeploymentConfig>(jsonContent);
            return result;

        }

        public static string GetDeploymentScriptPath(string fileName)
        {            
            string projectOutputDirectory = Path.GetDirectoryName(typeof(DbDeploymentConfig).GetTypeInfo().Assembly.Location);
            string result = Path.Combine(projectOutputDirectory, "DeploymentScripts", fileName);
            return result;
        }
    }

    public class EsfConnectionStrings
    {
        public string esFiddleDb { get; set; }
    }
}
