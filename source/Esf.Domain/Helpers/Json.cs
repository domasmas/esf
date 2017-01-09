using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Esf.Domain.Helpers
{
    public static class JSON
    {
        public static string Serialize(object @object, bool format = false)
        {
            return JsonConvert.SerializeObject(@object, 
                format ? Formatting.Indented : Formatting.None,
                new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                });
        }

        public static T Deserialize<T>(string value)
        {
            return JsonConvert.DeserializeObject<T>(value, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });
        }

        public static string EnsureSingleLine(string content)
        {
            return JsonConvert.SerializeObject(Deserialize<dynamic>(content), Formatting.None);
        }
    }
}
