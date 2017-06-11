using Newtonsoft.Json;

namespace Esf.Domain.Exceptions
{
    [JsonObject(MemberSerialization.OptIn)]
    public class EsfUnexpectedException : EsfException
    {
        [JsonProperty]
        public override string Type => nameof(EsfInvalidStateException);
        [JsonProperty]
        public string ErrorMessage { get; set; }
    }
}
