using System;

namespace Esf.Domain
{
    public interface IUniqueNameResolver
    {
        string GetUniqueName();
    }

    public class UniqueNameResolver : IUniqueNameResolver
    {
        public string GetUniqueName()
        {
            return Guid.NewGuid().ToString();
        }
    }
}