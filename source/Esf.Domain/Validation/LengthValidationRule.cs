using System;

namespace Esf.Domain.Validation
{
    public class LengthValidationRule : InputValidationRule
    {
        protected readonly int _maxLength;

        public LengthValidationRule(int maxLength)
        {
            _maxLength = maxLength;
        }

        public InputValidationResponse Validate(string fieldName, string input)
        {
            if (!String.IsNullOrEmpty(input) && input.Length > _maxLength)
            {
                return new InputValidationResponse
                {
                    IsValid = false,
                    ErrorMessage = $"{fieldName} is longer than {_maxLength} characters"
                };
            }

            return new InputValidationResponse
            {
                IsValid = true
            };
        }
    }
}