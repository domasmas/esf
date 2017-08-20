using System;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public interface IElasticsearchSession : IDisposable
    {
        Task CreateMapping(string mappingObject);
        Task InsertDocuments(params string[] documents);
        Task<EsfQueryRunResult> RunQuery(string query);
        void Cleanup();
    }
}
