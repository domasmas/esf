using System.Collections.Generic;

namespace Esf.Domain.Validation
{
    public interface IEsfStateValidator
    {
        IEnumerable<InputValidationResponse> GetStateErrors(string mapping, string query, string[] documents);
    }
}