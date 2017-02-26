using MongoDB.Driver;
using MongoDB.Driver.Core.Clusters;
using MongoDB.Driver.Core.Misc;
using NUnit.Framework;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace Esf.DataAccess.Tests
{
    [TestFixture]
    public class EsFiddleDeploymentTests
    {
        private IMongoDatabase _database;

        [SetUp]
        public void Setup()
        {
            var connections = System.Configuration.ConfigurationManager.ConnectionStrings;
            _database = new EsDatabaseClient(connections["EsFiddleDb"].ConnectionString).Database;
        }              
        
        [Test]
        public void IsDatabaseUp()
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
        public void IsDatabaseVersion3_2()
        {
            SemanticVersion databaseVersion = _database.Client.Cluster.Description.Servers[0].Version;
            Assert.AreEqual(databaseVersion.Major, 3);
            Assert.AreEqual(databaseVersion.Minor, 2);
            Assert.AreEqual(databaseVersion.PreRelease, null);
        }
        
        [Test]
        public async Task IsVersion1UpgradeScriptApplied()
        {
            Expression<Func<UpgradeScriptAuditRecord, bool>> v1UpgradeScriptCondition = (auditRecord) => auditRecord.Version == "1.0";
            long v1UpgradeAuditRecords = await _database.GetCollection<UpgradeScriptAuditRecord>("upgradeScriptsAudit").Find(v1UpgradeScriptCondition).CountAsync();
            Assert.GreaterOrEqual(v1UpgradeAuditRecords, 1);
        }                
    }
}
