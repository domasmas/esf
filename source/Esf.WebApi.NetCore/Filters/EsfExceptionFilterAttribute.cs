using Esf.WebApi.Exceptions;
using Microsoft.AspNetCore.Mvc.Filters;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;

namespace Esf.WebApi.Filters
{
    public class EsfExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            if (context.Exception is EsfValidationException)
            {
                context.HttpContext.Response.StatusCode = (int) HttpStatusCode.BadRequest;
                using (var bodyStream = new MemoryStream())
                {
                    var bodyWriter = new StreamWriter(bodyStream);
                    context.HttpContext.Response.Body = bodyStream;
                    bodyWriter.WriteLine(((EsfValidationException)context.Exception).ErrorMessage);
                }
            }

            base.OnException(context);
        }
    }
}