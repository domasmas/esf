namespace Esf.Domain.Exceptions
{
    public class EsfElasticSearchException : EsfException
    {
        public EsfElasticSearchException(ElasticSearchExceptionDetails details) : base(details)
        {
        }

        public override string Type => nameof(EsfElasticSearchException);

        public class ElasticSearchExceptionDetails : EsfException.ExceptionDetails
        {
            public int StatusCode { get; set; }
            public string ErrorMessage { get; set; }
        }
    }
}
