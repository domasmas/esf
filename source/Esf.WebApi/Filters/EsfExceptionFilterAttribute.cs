using Esf.WebApi.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Esf.WebApi.Filters
{
    public class EsfExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            if (context.Exception is EsfValidationException)
            {
                var result = new JsonResult(((EsfValidationException)context.Exception).ErrorMessage);
                result.StatusCode = (int) System.Net.HttpStatusCode.BadRequest;
                context.Result = result;
            }

            base.OnException(context);
        }
    }
}