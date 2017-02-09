using Elasticsearch.Net;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public interface IEsfQueryRunner
    {
        Task<EsfQuerySessionResponse> Run(string mappingObject, string[] documents, string query);
    }
}