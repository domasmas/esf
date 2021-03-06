﻿using Esf.Domain.Helpers;
using System;

namespace Esf.Domain.Validation
{
    public class JsonValidationRule : InputValidationRule
    {
        public InputValidationResponse Validate(string fieldName, string input)
        {
            try
            {
                JSON.Deserialize<dynamic>(input);
            }
            catch (Exception exception)
            {
                return new InputValidationResponse
                {
                    IsValid = false,
                    ErrorMessage = exception.Message
                };
            }

            return new InputValidationResponse
            {
                IsValid = true
            };
        }
    }
}