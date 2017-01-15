using System.Threading.Tasks;

namespace Esf.Domain
{
    public interface IEsfQueryRunner
    {
        Task<string> Run(string mappingObject, string[] documents, string query);
    }
}