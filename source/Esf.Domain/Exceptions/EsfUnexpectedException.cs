namespace Esf.Domain.Exceptions
{
    public class EsfUnexpectedException : EsfException
    {
        public EsfUnexpectedException(UnexpectedExceptionDetails details) : base(details)
        {
        }

        public override string Type => nameof(EsfInvalidStateException);

        public class UnexpectedExceptionDetails: ExceptionDetails
        {
            public string ErrorMessage { get; set; }
        }
    }
}
