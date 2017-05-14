using System;

namespace Esf.WebApi.Exceptions
{
    public abstract class EsfException : ApplicationException
    {
        public string ErrorMessage { get; set; }
    }
}