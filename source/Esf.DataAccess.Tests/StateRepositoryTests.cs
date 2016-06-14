using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.DataAccess.Tests
{
    [TestFixture]
    public class StateRepositoryTests
    {
        [Test]
        public async Task TestStateRepositorySetup()
        {
            var stateRepository = new StateRepository();
            await stateRepository.InsertSampleDate();
            await stateRepository.ReadSampleDate();
        }
    }
}
