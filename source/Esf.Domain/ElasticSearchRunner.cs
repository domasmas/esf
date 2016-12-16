using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public class TestDoc
    {
        public int Id { get; set; }
        public string Field1 { get; set; }
        public int Field2 { get; set; }
    }

    public class ElasticSearchRunner
    {
        private ElasticClient elastic;
        public ElasticSearchRunner()
        {
            var local = new Uri("http://localhost:9200");
            var settings = new ConnectionSettings(local);
            elastic = new ElasticClient(settings);
        }
        public ICreateResponse Run()
        {
            ICreateResponse res = elastic.Create<TestDoc>(new TestDoc()
            {
                Id = 222,
                Field1 = "value 1",
                Field2 = 44
            }, desc => desc.Index("testdoc").Id("1"));
            return res;
        }

        public IGetResponse<TestDoc> RunTest2()
        {
            IGetResponse<TestDoc> res = elastic.Get<TestDoc>(DocumentPath<TestDoc>.Id(222), docDesc => docDesc.Index("testdoc"));
            return res;
        }
    }
}
