using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;

namespace Esf.DataAccess.IntegrationTests
{
    public class EsStatesRepositoryFixture : IDisposable
    {
        private string mongoDbServerDirectory;
        private IEsDatabaseClient _database;

        public EsStatesRepositoryFixture()
        {
            var dbDeploymentConfig = DbDeploymentConfig.Load();
            _esFiddleConnectionString = dbDeploymentConfig.ConnectionStrings.esFiddleDb;
            mongoDbServerDirectory = dbDeploymentConfig.mongoDbServerDirectory;
            string dbDeploymentPath = Path.Combine(dbDeploymentConfig.esFiddleDbPath, "IntegrationTests");
            SetupDbPathAndLogFile(dbDeploymentPath);
            var arguments = string.Format(@"-dbpath ""{0}\\DB"" -logpath ""{1}\\Log.log""", dbDeploymentPath, dbDeploymentPath);
            var startInfo = new ProcessStartInfo(mongoDbServerDirectory + "mongod.exe", arguments);
            Process.Start(startInfo);
        }

        private void SetupDbPathAndLogFile(string dbDeploymentPath)
        {
            if (Directory.Exists(dbDeploymentPath))
                Directory.Delete(dbDeploymentPath, true);
            Directory.CreateDirectory(dbDeploymentPath);
            Directory.CreateDirectory(dbDeploymentPath + "\\DB");
        }

        private string _esFiddleConnectionString;

        public string esFiddleConnectionString
        {
            get
            {
                return _esFiddleConnectionString;
            }
        }

        public void Dispose()
        {
            string stopDbServerPath = DbDeploymentConfig.GetDeploymentScriptPath("StopDbServer.js");
            Process.Start(mongoDbServerDirectory + "mongo.exe", stopDbServerPath);
        }
    }
}
