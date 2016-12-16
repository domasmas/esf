using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain.Tests
{
    [TestFixture]
    public class ElasticSearchRunnerTests
    {
        [Test]
        public void Run()
        {
            var runner = new ElasticSearchRunner();
            var response = runner.Run();
            Console.WriteLine(response.Result.ToString());
            Assert.IsTrue(response.IsValid);
        }

        [Test]
        public void Run2()
        {
            var runner = new ElasticSearchRunner();
            var response = runner.RunTest2();
            Console.WriteLine(response.DebugInformation);
        }
    }
}
