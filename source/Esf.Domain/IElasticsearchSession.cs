using System;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public interface IElasticsearchSession : IDisposable
    {
        Task<EsfCreateResourceResponse> CreateMapping(string mappingObject);
        Task<EsfCreateResourceResponse> InsertDocuments(params string[] documents);
        Task<EsfQueryResponse> RunQuery(string query);
        void Cleanup();
    }
}
