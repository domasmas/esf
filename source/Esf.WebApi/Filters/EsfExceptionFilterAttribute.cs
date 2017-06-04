using Esf.WebApi.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net.Http;

namespace Esf.WebApi.Filters
{
    public class EsfExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            if (context.Exception is EsfValidationException)
            {
                context.HttpContext.Response. = new TextPlainErrorResult(System.Net.HttpStatusCode.BadRequest)
                {
                    Content = new StringContent(((EsfValidationException)context.Exception).ErrorMessage),
                    ReasonPhrase = "Esf Exception"
                };
            }

            base.OnException(context);
        }
    }
}