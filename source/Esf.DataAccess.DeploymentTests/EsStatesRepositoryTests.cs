using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Esf.DataAccess.Tests
{
    [TestFixture]
    public class EsStatesRepositoryTests
    {
        private DbDeploymentConfig _dbDeploymentConfig;

        private string GetDeploymentScriptPath(string fileName)
        {
            
            string projectDirectory = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            string result = Path.Combine(projectDirectory, "DeploymentScripts", fileName);
            return result;
        }

        [OneTimeSetUp]
        public void Init()
        {
            string dbDeploymentConfigPath = GetDeploymentScriptPath("dbDeploymentConfig.json");
            var jsonContent = File.ReadAllText(dbDeploymentConfigPath);
            _dbDeploymentConfig = JsonConvert.DeserializeObject<DbDeploymentConfig>(jsonContent);
            Directory.Delete(_dbDeploymentConfig.mongoDbPath, true);
            Directory.CreateDirectory(_dbDeploymentConfig.mongoDbPath);
            using (File.CreateText(_dbDeploymentConfig.mongoDbLogPath))
            {

            }
            var arguments = string.Format(@"-dbpath ""{0}"" -logpath ""{1}""", _dbDeploymentConfig.mongoDbPath, _dbDeploymentConfig.mongoDbLogPath);
            var startInfo = new ProcessStartInfo(_dbDeploymentConfig.mongoDbServerDirectory + "mongod.exe", arguments);
            Process.Start(startInfo);
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            string stopDbServerPath = GetDeploymentScriptPath("StopDbServer.js");
            Process.Start(_dbDeploymentConfig.mongoDbServerDirectory + "mongo.exe", stopDbServerPath);
        }

        [Test]
        public async Task TestStateRepositorySetup()
        {
            var stateRepository = new EsStatesRepository();
            await stateRepository.InsertSampleDate();
            await stateRepository.ReadSampleDate();
        }

        [Test]
        public async Task TestEsStatesCollection()
        {
            var esStatesRepository = new EsStatesRepository();
            var testData = new EsState()
            {
                Documents = new List<string>()
                {
                    "Doc1",
                    "Doc2"
                },
                Mapping = "mapping",
                Query = "query"
            };
            await esStatesRepository.InsertEsState(testData);
            var actualCollection = await esStatesRepository.GetEsStatesCollection();
            Assert.AreEqual(actualCollection[0].Mapping, "mapping");
            Assert.AreEqual(actualCollection[0].Query, "query");
            Console.WriteLine(actualCollection[0]._id);
        }
    }
}
