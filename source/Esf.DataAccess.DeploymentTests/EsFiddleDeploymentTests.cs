using MongoDB.Driver;
using MongoDB.Driver.Core.Clusters;
using MongoDB.Driver.Core.Misc;
using Xunit;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace Esf.DataAccess.DeploymentTests
{
    public class EsFiddleDeploymentTests : IClassFixture<EsFiddleDbFixture>
    {
        private EsFiddleDbFixture _esFiddleDb;
        
        public EsFiddleDeploymentTests(EsFiddleDbFixture esFiddleDb)
        {
            _esFiddleDb = esFiddleDb;
        }              
        
        [Fact]
        public void IsDatabaseUp()
        {
            IMongoDatabase mongoDb = _esFiddleDb.Database;
            _esFiddleDb.WaitForConditionUntilTimeout(() => mongoDb.Client.Cluster.Description.State == ClusterState.Connected,
                () =>
                {
                    Assert.Equal("esFiddle", mongoDb.DatabaseNamespace.DatabaseName);
                }
                , "Database could not be brought up in timely manner");
        }
        


        [Fact]
        public void IsDatabaseVersion3_2()
        {
            IMongoDatabase mongoDb = _esFiddleDb.Database;
            _esFiddleDb.WaitForConditionUntilTimeout(() => mongoDb.Client.Cluster.Description.State == ClusterState.Connected, 
                () =>
                {
                    SemanticVersion databaseVersion = mongoDb.Client.Cluster.Description.Servers[0].Version;
                    Assert.Equal(3, databaseVersion.Major);
                    Assert.Equal(2, databaseVersion.Minor);
                    Assert.Null(databaseVersion.PreRelease);
                }, "Database could not be brought up in timely manner");
        }
        
        [Fact]
        public async Task IsVersion1UpgradeScriptApplied()
        {
            Expression<Func<UpgradeScriptAuditRecord, bool>> v1UpgradeScriptCondition = (auditRecord) => auditRecord.Version == "1.0";
            long v1UpgradeAuditRecordsCount = await _esFiddleDb.Database.GetCollection<UpgradeScriptAuditRecord>("upgradeScriptsAudit").Find(v1UpgradeScriptCondition).CountAsync();
            Assert.True(v1UpgradeAuditRecordsCount >= 1);
        }                
    }
}
