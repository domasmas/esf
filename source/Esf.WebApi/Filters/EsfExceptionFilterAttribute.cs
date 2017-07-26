using Esf.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Esf.WebApi.Filters
{
    public class EsfExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private readonly EsfExceptionSerializer _serializer;

        public EsfExceptionFilterAttribute(EsfExceptionSerializer serializer)
        {
            _serializer = serializer;
        }

        public override void OnException(ExceptionContext context)
        {
            if (context.Exception is EsfException)
            {
                var result = new JsonResult(_serializer.Serialize(context.Exception));
                result.StatusCode = (int) System.Net.HttpStatusCode.BadRequest;
                context.Result = result;
            }

            base.OnException(context);
        }
    }
}
