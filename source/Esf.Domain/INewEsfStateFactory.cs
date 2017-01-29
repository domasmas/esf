using Esf.DataAccess;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public interface INewEsfStateFactory
    {
        Task<EsState> GetNewState();
    }
}