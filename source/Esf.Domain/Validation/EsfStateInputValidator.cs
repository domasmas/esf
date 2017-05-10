using System.Collections.Generic;
using System.Linq;

namespace Esf.Domain.Validation
{
    public class EsfStateInputValidator : IEsfStateInputValidator
    {
        public const int MaxJsonFieldLength = 10000;

        private readonly InputValidationRule _jsonValidationRule;
        private readonly InputValidationRule _lengthValidationRule;

        public EsfStateInputValidator()
        {
            _jsonValidationRule = new JsonValidationRule();
            _lengthValidationRule = new LengthValidationRule(MaxJsonFieldLength);
        }

        public IEnumerable<InputValidationResponse> GetErrors(string fieldName, string input)
        {
            return GetValidationResponses(fieldName, input)
                .Where(r => !r.IsValid);
        }

        private IEnumerable<InputValidationResponse> GetValidationResponses(string fieldName, string input)
        {
            yield return _lengthValidationRule.Validate(fieldName, input);
            yield return _jsonValidationRule.Validate(fieldName, input);
        }
    }
}
