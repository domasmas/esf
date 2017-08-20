using System.Threading.Tasks;

namespace Esf.Domain
{
    public interface IEsfQueryRunner
    {
        Task<EsfQueryRunResult> Run(string mappingObject, string[] documents, string query);
    }
}