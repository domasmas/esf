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
        private IMongoDatabase _database;

        [SetUp]
        public void Setup()
        {
            _database = new EsDatabaseClient().Database;
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
    }
}
