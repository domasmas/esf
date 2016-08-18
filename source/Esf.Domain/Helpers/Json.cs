﻿using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Esf.Domain.Helpers
{
    public static class JSON
    {
        public static string Serialize(object @object)
        {
            return JsonConvert.SerializeObject(@object, new JsonSerializerSettings
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
    }
}
