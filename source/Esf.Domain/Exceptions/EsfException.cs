using Newtonsoft.Json;
using System;

namespace Esf.Domain.Exceptions
{
    [JsonObject(MemberSerialization.OptIn)]
    public abstract class EsfException : Exception
    {
        public abstract string Type { get; }
    }
}