using Esf.Domain.Exceptions;

namespace Esf.WebApi.Filters
{
    public class EsfExceptionDto
    {
        public string Type { get; set; }
        public EsfException.ExceptionDetails Details { get; set; }
    }
}