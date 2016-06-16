using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.DataAccess.Tests
{
    [TestFixture]
    public class EsStatesRepositoryTests
    {
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
                Query =  "query"
            };
            await esStatesRepository.InsertEsState(testData);
            var actualCollection = await esStatesRepository.GetEsStatesCollection();
            Assert.AreEqual(actualCollection.Count, 1);
            Assert.AreEqual(actualCollection[0].Mapping, "mapping");
            Assert.AreEqual(actualCollection[0].Query, "query");
            Console.WriteLine(actualCollection[0]._id);
        }
    }
}
