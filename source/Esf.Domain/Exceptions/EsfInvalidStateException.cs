namespace Esf.Domain.Exceptions
{
    public class EsfInvalidStateException : EsfException
    {
        public EsfInvalidStateException(EsfStateErrorDetails errors)
            :base(errors)
        {
        }

        public override string Type => nameof(EsfInvalidStateException);

        public class EsfStateErrorDetails: ExceptionDetails
        {
            public string Mapping { get; set; }
            public string Query { get; set; }
            public string Documents { get; set; }
        }
    }
}