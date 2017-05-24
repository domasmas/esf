using System;

namespace Esf.Domain.Exceptions
{
    public abstract class EsfException : ApplicationException
    {
        protected ExceptionDetails _details;

        public EsfException(ExceptionDetails details)
        {
            _details = details;
        }

        public abstract string Type { get; }

        public ExceptionDetails Details
        {
            get  { return _details; }
        }

        public class ExceptionDetails
        {
        }
    }
}