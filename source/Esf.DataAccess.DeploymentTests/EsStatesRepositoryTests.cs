﻿using MongoDB.Driver;
using MongoDB.Driver.Core.Clusters;
using MongoDB.Driver.Core.Misc;
using NUnit.Framework;
using System;
using System.Diagnostics;
using System.IO;
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
            var arguments = string.Format(@"-dbpath ""{0}\\DB"" -logpath ""{1}\\Log.log""", _dbDeploymentConfig.esFiddleDbPath, _dbDeploymentConfig.esFiddleDbPath);
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
            if (Directory.Exists(_dbDeploymentConfig.esFiddleDbPath))
                Directory.Delete(_dbDeploymentConfig.esFiddleDbPath, true);
            Directory.CreateDirectory(_dbDeploymentConfig.esFiddleDbPath);
            Directory.CreateDirectory(_dbDeploymentConfig.esFiddleDbPath + "\\DB");
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
            TimeSpan timeoutSpan = new TimeSpan(0, 0, 0, 0, 5000);
            DateTime timeout = DateTime.Now.Add(timeoutSpan);
            do
            {
                if (_database.Client.Cluster.Description.State == ClusterState.Connected)
                {
                    Assert.AreEqual(_database.DatabaseNamespace.DatabaseName, "esFiddle");
                    Assert.Pass();
                }
                Thread.Sleep(100);
            }
            while (DateTime.Now < timeout);
            Assert.Fail(); 
        }
        
        [Test]
        public void TestDatabaseVersionIs3_2()
        {
            SemanticVersion databaseVersion = _database.Client.Cluster.Description.Servers[0].Version;
            Assert.AreEqual(databaseVersion.Major, 3);
            Assert.AreEqual(databaseVersion.Minor, 2);
            Assert.AreEqual(databaseVersion.PreRelease, null);
        }

        [Test]
        public async Task TestEsStatesCollectionInsertReadDelete()
        {
            var esStatesRepository = new EsStatesRepository(_database);
            Func<int> getEsStatesRepositoryCount = () => (esStatesRepository.FindEsStates((esState) => true)).Result.Count; 
            int initialEsStatesCount = getEsStatesRepositoryCount();
            var testData1 = new EsStateBuilder().SetQuery("query1").SetMapping("mapping").SetStateUrl(Guid.NewGuid())
                    .SetDocuments("doc1", "doc2").Build();

            var insertedState = await esStatesRepository.InsertEsState(testData1);

            var readState = await esStatesRepository.GetEsState(insertedState.Id);
            Assert.AreEqual(insertedState.Id, readState.Id);
            Assert.AreEqual(insertedState.Query, readState.Query);
            Assert.AreEqual(insertedState.Mapping, readState.Mapping);
            Assert.AreEqual(insertedState.StateUrl, readState.StateUrl);
            Action<string, string> verifyInsertedEqualsRead = (string insertedDoc, string readDoc) =>
            {
                Assert.AreEqual(insertedDoc, readDoc);
            };
            for (int i = 0; i < insertedState.Documents.Count; i++)
                verifyInsertedEqualsRead(insertedState.Documents[i], readState.Documents[i]);

            bool isAcknowledgedDeletion = await esStatesRepository.DeleteEsState(readState.Id);
            Assert.IsTrue(isAcknowledgedDeletion);

            int finalEsStatesCount = getEsStatesRepositoryCount();
            Assert.AreEqual(initialEsStatesCount, finalEsStatesCount);
        }
    }
}
