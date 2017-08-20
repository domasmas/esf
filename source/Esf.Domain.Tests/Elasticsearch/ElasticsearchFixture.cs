using Elasticsearch.Net;
using Esf.Domain.Helpers;
using Esf.Domain.Validation;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using Xunit.Abstractions;

namespace Esf.Domain.Tests.Elasticsearch
{
    public class ElasticsearchFixture
    {
        private IEsfQueryRunner _esfQueryRunner;

        public ElasticsearchFixture(Uri esfQueryRunnerUri)
            :this(esfQueryRunnerUri, new UniqueNameResolver(), new IdGenerator())
        { }

        public ElasticsearchFixture(Uri esfQueryRunnerUri, IUniqueNameResolver uniqueNameResolver, IIdGenerator idGenerator)
        {
            var esConfig = new ConnectionConfiguration(esfQueryRunnerUri);
            var esClient = new ElasticLowLevelClient(esConfig);
            var validator = new EsfStateInputValidator();
            var stateValidator = new EsfStateValidator();
            var elasticsearchFactory = new ElasticsearchSessionFactory(esClient, uniqueNameResolver, idGenerator, validator);
            _esfQueryRunner = new EsfQueryRunner(elasticsearchFactory, stateValidator);
        }

        public EsfQuerySessionResponseFixture RunQuery(object mapping, object[] documents, object query)
        {
            string serializedMapping = JSON.Serialize(mapping);
            string[] serializedDocuments = documents.Select((document) => JSON.Serialize(document)).ToArray();
            string serializedQuery = JSON.Serialize(query);

            var esfSessionResponse = _esfQueryRunner.Run(serializedMapping, serializedDocuments, serializedQuery).Result;

            return new EsfQuerySessionResponseFixture(esfSessionResponse);
        }

        public EsfQuerySessionResponseFixture RunRawQuery(string mapping, string[] documents, string query)
        {
            var esfSesionResponse = _esfQueryRunner.Run(mapping, documents, query).Result;
            return new EsfQuerySessionResponseFixture(esfSesionResponse);
        }

        public void LogTestRun(string jsonToLog, [CallerMemberName] string testMethodName = "")
        {
            string outputPath = Path.Combine(Path.GetDirectoryName(Directory.GetCurrentDirectory()), "ElasticserachTests");
            if (!Directory.Exists(outputPath))
                Directory.CreateDirectory(outputPath);
            
            outputPath = string.Format("{0}\\{1}.json", outputPath, testMethodName);
            Console.WriteLine(outputPath);
            File.WriteAllText(outputPath, jsonToLog);
        }

        public void LogTestRun(dynamic objectToLog)
        {
            LogTestRun(JSON.Serialize(objectToLog, true));
        }        
    }    
}
