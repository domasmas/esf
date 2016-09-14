﻿using Newtonsoft.Json;
using System.IO;
using System.Reflection;

namespace Esf.DataAccess.Tests
{
    public class DbDeploymentConfig
    {
        public string mongoDbServerDirectory { get; set; }
        public string esFiddleDbPath { get; set; }

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