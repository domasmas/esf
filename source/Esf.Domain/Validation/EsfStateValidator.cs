using System;
using System.Collections.Generic;
using System.Linq;

namespace Esf.Domain.Validation
{
    public class EsfStateValidator : IEsfStateValidator
    {
        public const int MaxJsonFieldLength = 10000;

        public IEnumerable<InputValidationResponse> GetStateErrors(string mapping, string query, string[] documents)
        {
            return GetValidationResponses(mapping, query, documents)
                .Where(r => !r.IsValid);
        }

        private IEnumerable<InputValidationResponse> GetValidationResponses(string mapping, string query, string[] documents)
        {
            var jsonFieldValidationRule = new JsonValidationRule();
            var lenghtValidationRule = new LengthValidationRule(MaxJsonFieldLength);

            yield return lenghtValidationRule.Validate("mapping", mapping);
            yield return lenghtValidationRule.Validate("query", mapping);

            int index = 0;
            foreach (var document in documents)
            {
                yield return lenghtValidationRule.Validate($"document[{index++}]", document);
            }
            
            yield return jsonFieldValidationRule.Validate("mapping", Truncate(mapping));
            yield return jsonFieldValidationRule.Validate("query", Truncate(query));

            index = 0;
            foreach (var document in documents)
            {
                yield return jsonFieldValidationRule.Validate($"document[{index++}]", document);
            }
        }

        private static string Truncate(string input) => input?.Substring(0, Math.Min(input.Length, MaxJsonFieldLength));
    }
}