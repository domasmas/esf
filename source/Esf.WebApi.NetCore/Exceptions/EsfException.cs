using System;

namespace Esf.WebApi.Exceptions
{
    public abstract class EsfException : Exception
    {
        public string ErrorMessage { get; set; }
    }
}