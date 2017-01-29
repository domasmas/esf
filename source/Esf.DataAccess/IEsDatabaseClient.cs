using MongoDB.Driver;

namespace Esf.DataAccess
{
    public interface IEsDatabaseClient
    {
        IMongoDatabase Database { get; }
    }
}
