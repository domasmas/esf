using Esf.Domain.Helpers;
using System;

namespace Esf.Domain.Exceptions
{
    public class EsfExceptionSerializer
    {
        public string Serialize(Exception exception)
        {
            if (exception is EsfException)
            {
                return JSON.Serialize(exception);
            }
            else
            {
                var exceptionDetails = new EsfUnexpectedException
                {
                    ErrorMessage = "Unexpected Error"
                };

                return JSON.Serialize(exceptionDetails);
            }
        }
    }
}