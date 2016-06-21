using MongoDB.Driver;
using MongoDB.Driver.Core.Clusters;
using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Esf.DataAccess.Tests
{
    [TestFixture]
    public class EsStatesRepositoryTests
    {
        private DbDeploymentConfig _dbDeploymentConfig;
        private IMongoDatabase _database;

        [OneTimeSetUp]
        public void Init()
        {
            _dbDeploymentConfig = DbDeploymentConfig.Load();
            SetupDbPathAndLogFile();
            var arguments = string.Format(@"-dbpath ""{0}"" -logpath ""{1}""", _dbDeploymentConfig.mongoDbPath, _dbDeploymentConfig.mongoDbLogPath);
            var startInfo = new ProcessStartInfo(_dbDeploymentConfig.mongoDbServerDirectory + "mongod.exe", arguments);
            Process.Start(startInfo);
        }

        [SetUp]
        public void Setup()
        {
            _database = new EsDatabaseClient().Database;
        }

        private void SetupDbPathAndLogFile()
        {
            if (Directory.Exists(_dbDeploymentConfig.mongoDbPath))
                Directory.Delete(_dbDeploymentConfig.mongoDbPath, true);
            Directory.CreateDirectory(_dbDeploymentConfig.mongoDbPath);
            using (File.CreateText(_dbDeploymentConfig.mongoDbLogPath))
            {

            }
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            string stopDbServerPath = DbDeploymentConfig.GetDeploymentScriptPath("StopDbServer.js");
            Process.Start(_dbDeploymentConfig.mongoDbServerDirectory + "mongo.exe", stopDbServerPath);
        }
        
        [Test]
        public void TestDatabaseIsUp()
        {
            TimeSpan timeoutSpan = new TimeSpan(0, 0, 0, 0, 500);
            DateTime timeout = DateTime.Now.Add(timeoutSpan);
            do
            {
                if (_database.Client.Cluster.Description.State == ClusterState.Connected)
                    Assert.Pass();
                Thread.Sleep(100);
            }
            while (DateTime.Now < timeout);
            Assert.Fail(); 
        }

        [Test]
        public async Task TestEsStatesInsert()
        {
            var esStatesRepository = new EsStatesRepository(_database);
            var testData1 = new EsStateBuilder().SetQuery("query1").Build();
            var testData2 = new EsStateBuilder().SetQuery("query3").Build();
            var testData3 = new EsStateBuilder().SetQuery("query3").Build();

            var inserted1 = await esStatesRepository.InsertEsState(testData1);
            var inserted2 = await esStatesRepository.InsertEsState(testData2);
            var inserted3 = await esStatesRepository.InsertEsState(testData3);           
        }

        [Test]
        public async Task TestEsStatesRead()
        {
            var esStatesRepository = new EsStatesRepository(_database);
            var testData = new EsStateBuilder().SetQuery("query1").Build();

            var inserted = await esStatesRepository.InsertEsState(testData);
            var read = await esStatesRepository.GetEsState(inserted.Id);
            Assert.AreEqual(inserted.Id, read.Id);
            Assert.AreEqual(inserted.Query, read.Query);
        }
    }
}
