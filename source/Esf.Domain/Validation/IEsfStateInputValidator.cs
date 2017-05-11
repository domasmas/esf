using System.Collections.Generic;

namespace Esf.Domain.Validation
{
    public interface IEsfStateInputValidator
    {
        IEnumerable<InputValidationResponse> GetErrors(string fieldName, string input);
    }
}
