using System.Web.Http;
using Newtonsoft.Json.Serialization;
using System.Web.Http.Cors;
using Newtonsoft.Json;
using System.Net.Http.Formatting;

namespace Esf.WebApi
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            ConfigureJsonSerializer(config);

            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            //config.SuppressDefaultHostAuthentication();
            var corsAttr = new EnableCorsAttribute("*", "*", "*", "Access-Control-Allow-Origin");
            config.EnableCors(corsAttr);

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }

        private static void ConfigureJsonSerializer(HttpConfiguration config)
        {
            var formatters = config.Formatters;
            formatters.Clear();
            var jsonFormatter = new JsonMediaTypeFormatter();
            var settings = jsonFormatter.SerializerSettings;
            settings.Formatting = Formatting.Indented;
            settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            formatters.Add(jsonFormatter);
        }
    }
}
