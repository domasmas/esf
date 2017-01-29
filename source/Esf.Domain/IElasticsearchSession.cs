using System;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public interface IElasticsearchSession : IDisposable
    {
        Task<bool> CreateMapping(string mappingObject);
        Task<bool> InsertDocuments(params string[] documents);
        Task<string> RunQuery(string query);
        void Cleanup();
    }
}
