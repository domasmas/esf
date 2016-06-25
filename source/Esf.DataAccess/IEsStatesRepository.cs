using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Esf.DataAccess
{
    public interface IEsStatesRepository
    {
        Task<bool> DeleteEsState(string id);
        Task<IList<EsState>> FindEsStates(Expression<Func<EsState, bool>> filter);
        Task<EsState> GetEsState(string id);
        Task<EsState> InsertEsState(EsState state);
    }
}