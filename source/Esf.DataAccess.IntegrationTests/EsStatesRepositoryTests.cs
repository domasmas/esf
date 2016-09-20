using MongoDB.Driver;
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
        private string mongoDbServerDirectory;
        private IMongoDatabase _database;

        [OneTimeSetUp]
        public void Init()
        {
            var dbDeploymentConfig = DbDeploymentConfig.Load();
            mongoDbServerDirectory = dbDeploymentConfig.mongoDbServerDirectory;
            string dbDeploymentPath = Path.Combine(dbDeploymentConfig.esFiddleDbPath, "IntegrationTests");
            SetupDbPathAndLogFile(dbDeploymentPath); 
            var arguments = string.Format(@"-dbpath ""{0}\\DB"" -logpath ""{1}\\Log.log""", dbDeploymentPath, dbDeploymentPath);
            var startInfo = new ProcessStartInfo(mongoDbServerDirectory + "mongod.exe", arguments);
            Process.Start(startInfo);
        }

        [SetUp]
        public void Setup()
        {
            _database = new EsDatabaseClient().Database;
        }

        private void SetupDbPathAndLogFile(string dbDeploymentPath)
        {
            if (Directory.Exists(dbDeploymentPath))
                Directory.Delete(dbDeploymentPath, true);
            Directory.CreateDirectory(dbDeploymentPath);
            Directory.CreateDirectory(dbDeploymentPath + "\\DB");
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            string stopDbServerPath = DbDeploymentConfig.GetDeploymentScriptPath("StopDbServer.js");
            Process.Start(mongoDbServerDirectory + "mongo.exe", stopDbServerPath);
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
        public async Task TestEsStatesCollectionInsertReadDelete()
        {
            var esStatesRepository = new EsStatesRepository(_database);
            Func<int> getEsStatesRepositoryCount = () => (esStatesRepository.FindEsStates((esState) => true)).Result.Count; 
            int initialEsStatesCount = getEsStatesRepositoryCount();
            var testData1 = new EsStateBuilder().SetQuery("query1").SetMapping("mapping").SetStateUrl(Guid.NewGuid())
                    .SetDocuments("doc1, doc2").Build();

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
            verifyInsertedEqualsRead(insertedState.Documents, readState.Documents);

            bool isAcknowledgedDeletion = await esStatesRepository.DeleteEsState(readState.Id);
            Assert.IsTrue(isAcknowledgedDeletion);

            int finalEsStatesCount = getEsStatesRepositoryCount();
            Assert.AreEqual(initialEsStatesCount, finalEsStatesCount);
        }
    }
}
