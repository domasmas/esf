using Newtonsoft.Json;

namespace Esf.Domain.Exceptions
{
    [JsonObject(MemberSerialization.OptIn)]
    public class EsfInvalidStateException : EsfException
    {
        [JsonProperty]
        public override string Type => nameof(EsfInvalidStateException);
        [JsonProperty]
        public string[] Mapping { get; set; }
        [JsonProperty]
        public string[] Query { get; set; }
        [JsonProperty]
        public string[] Documents { get; set; }
    }
}