using Esf.Domain.Exceptions;
using System.Linq;

namespace Esf.Domain.Validation
{
    public class EsfStateValidator : IEsfStateValidator
    {
        public const int MaxJsonFieldLength = 10000;

        public void Validate(string mapping, string query, string[] documents)
        {
            var jsonFieldValidationRule = new JsonValidationRule();
            var lenghtValidationRule = new LengthValidationRule(MaxJsonFieldLength);

            var mappingErrors = new[] 
            {
                lenghtValidationRule.Validate("mapping", mapping),
                jsonFieldValidationRule.Validate("mapping", mapping)
            };

            var queryErrors = new[]
            {
                lenghtValidationRule.Validate("query", mapping),
                jsonFieldValidationRule.Validate("query", query)
            };

            var documentErrors = documents.SelectMany((document, ind) =>
            {
                return new[]
                {
                    lenghtValidationRule.Validate($"document[{ind}]", document),
                    jsonFieldValidationRule.Validate($"document[{ind}]", document)
                };
            });

            if (mappingErrors.Union(queryErrors).Union(documentErrors).Any(input => !input.IsValid))
            {
                throw new EsfInvalidStateException
                {
                    Mapping = mappingErrors.Where(e => !e.IsValid).Select(x => x.ErrorMessage).ToArray(),
                    Documents = documentErrors.Where(e => !e.IsValid).Select(x => x.ErrorMessage).ToArray(),
                    Query = queryErrors.Where(e => !e.IsValid).Select(x => x.ErrorMessage).ToArray()
                };
            }
        }
    }
}
