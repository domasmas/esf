using Esf.Domain.Exceptions;
using System.Net.Http;
using System.Web.Http.Filters;

namespace Esf.WebApi.Filters
{
    public class EsfExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private readonly EsfExceptionSerializer _serializer;

        public EsfExceptionFilterAttribute(EsfExceptionSerializer serializer)
        {
            _serializer = serializer;
        }

        public override void OnException(HttpActionExecutedContext context)
        {
            context.Response = new HttpResponseMessage(System.Net.HttpStatusCode.InternalServerError)
            {
                Content = new StringContent(_serializer.Serialize(context.Exception))
            };

            base.OnException(context);
        }
    }
}
