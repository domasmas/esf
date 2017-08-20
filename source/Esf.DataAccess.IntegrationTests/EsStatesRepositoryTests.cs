using MongoDB.Driver.Core.Clusters;
using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Esf.DataAccess.IntegrationTests
{
    public class EsStatesRepositoryTests: IClassFixture<EsStatesRepositoryFixture>
    {
        private EsStatesRepositoryFixture _esStatesRepositoryFixture;

        public EsStatesRepositoryTests(EsStatesRepositoryFixture esStatesRepositoryFixture)
        {
            _esStatesRepositoryFixture = esStatesRepositoryFixture;
        }

        [Fact]
        public void TestDatabaseIsUp()
        {
            TimeSpan timeoutSpan = new TimeSpan(0, 0, 0, 0, 5000);
            DateTime timeout = DateTime.Now.Add(timeoutSpan);
            var database = new EsDatabaseClient(_esStatesRepositoryFixture.esFiddleConnectionString);
            do
            {
                if (database.Database.Client.Cluster.Description.State == ClusterState.Connected)
                {
                    Assert.Equal("esFiddle", database.Database.DatabaseNamespace.DatabaseName);
                    return;
                }
                Thread.Sleep(100);
            }
            while (DateTime.Now < timeout);
            Assert.True(false, "Database could not be brought tup in timely manner"); 
        }
        
        [Fact]
        public async Task TestEsStatesCollectionInsertReadDelete()
        {
            var database = new EsDatabaseClient(_esStatesRepositoryFixture.esFiddleConnectionString);
            var esStatesRepository = new EsStatesRepository(database);
            Func<int> getEsStatesRepositoryCount = () => (esStatesRepository.FindEsStates((esState) => true)).Result.Count; 
            int initialEsStatesCount = getEsStatesRepositoryCount();
            var testData1 = new EsStateBuilder().SetQuery("query1").SetMapping("mapping").SetStateUrl(Guid.NewGuid())
                    .SetDocuments(new string[] { "doc1", "doc2" }).Build();

            var insertedState = await esStatesRepository.InsertEsState(testData1);

            var readState = await esStatesRepository.GetEsState(insertedState.Id);
            Assert.Equal(readState.Id, insertedState.Id);
            Assert.Equal(readState.Query, insertedState.Query);
            Assert.Equal(readState.Mapping, insertedState.Mapping);
            Assert.Equal(readState.StateUrl, insertedState.StateUrl);
            
            Action<string[], string[]> verifyInsertedEqualsRead = (string[] insertedDoc, string[] readDoc) =>
            {
                Assert.Equal(readDoc, insertedDoc);
            };
            verifyInsertedEqualsRead(insertedState.Documents, readState.Documents);

            bool isAcknowledgedDeletion = await esStatesRepository.DeleteEsState(readState.Id);
            Assert.True(isAcknowledgedDeletion);

            int finalEsStatesCount = getEsStatesRepositoryCount();
            Assert.Equal(finalEsStatesCount, initialEsStatesCount);
        }
    }
}
