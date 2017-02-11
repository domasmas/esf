using System;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public interface IElasticsearchSession : IDisposable
    {
        Task<EsfResponse> CreateMapping(string mappingObject);
        Task<EsfResponse> InsertDocuments(params string[] documents);
        Task<EsfResponse> RunQuery(string query);
        void Cleanup();
    }
}
