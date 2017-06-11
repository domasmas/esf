using Newtonsoft.Json;

namespace Esf.Domain.Exceptions
{
    [JsonObject(MemberSerialization.OptIn)]
    public class EsfElasticSearchException : EsfException
    {
        [JsonProperty]
        public override string Type => nameof(EsfElasticSearchException);
        [JsonProperty]
        public int StatusCode { get; set; }
        [JsonProperty]
        public string ErrorMessage { get; set; }
    }
}
