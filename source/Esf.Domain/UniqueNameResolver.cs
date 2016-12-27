using System;

namespace Esf.Domain
{
    public interface IUniqueNameResolver
    {
        string GetUniqueName(string prefix = null, string suffix = null);
    }

    public class UniqueNameResolver : IUniqueNameResolver
    {
        public string GetUniqueName(string prefix = null, string suffix = null)
        {
            return $"{prefix??""}{Guid.NewGuid().ToString()}{suffix}";
        }
    }
}