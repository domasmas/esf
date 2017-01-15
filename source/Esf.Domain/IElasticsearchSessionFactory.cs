using Nest;

namespace Esf.Domain
{
    public interface IElasticsearchSessionFactory
    {
        IElasticsearchSession Create();
    }
}