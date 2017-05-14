using Esf.WebApi.Exceptions;
using System.Net.Http;
using System.Web.Http.Filters;

namespace Esf.WebApi.Filters
{
    public class EsfExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            if (context.Exception is EsfValidationException)
            {
                context.Response = new HttpResponseMessage(System.Net.HttpStatusCode.BadRequest)
                {
                    Content = new StringContent(((EsfValidationException)context.Exception).ErrorMessage)
                };
            }

            base.OnException(context);
        }
    }
}