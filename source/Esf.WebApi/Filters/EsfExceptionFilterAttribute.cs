using Esf.Domain.Exceptions;
using Esf.Domain.Helpers;
using System.Net.Http;
using System.Web.Http.Filters;

namespace Esf.WebApi.Filters
{
    public class EsfExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            if (context.Exception is EsfException)
            {
                var esfException = ((EsfException)context.Exception);
                var exceptionDto = new EsfExceptionDto
                {
                    Type = esfException.Type,
                    Details = esfException.Details
                };

                context.Response = new HttpResponseMessage(System.Net.HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(JSON.Serialize(exceptionDto))
                };
            }
            else
            {
                var exceptionDetails = new EsfUnexpectedException.UnexpectedExceptionDetails
                {
#if DEBUG
                    ErrorMessage = context.Exception.Message
#else 
                    ErrorMessage = "Unexpected Error"
#endif
                };

                var exceptionDto = new EsfExceptionDto
                {
                    Type = nameof(EsfUnexpectedException),
                    Details = exceptionDetails
                };

                context.Response = new HttpResponseMessage(System.Net.HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(JSON.Serialize(exceptionDetails))
                };
            }

            base.OnException(context);
        }
    }
}
