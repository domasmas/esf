using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace EsFiddleweb.Models.Helpers
{
    public static class JsonSerialization
    {
        public static T Deserialize<T>(string text)
        {
            return JsonConvert.DeserializeObject<T>(text, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });
        }

        public static string Serialize<T>(T @object)
        {
            return JsonConvert.SerializeObject(@object, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });
        }
    }
}