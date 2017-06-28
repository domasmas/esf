namespace Esf.Domain.Validation
{
    public interface IEsfStateValidator
    {
        void Validate(string mapping, string query, string[] documents);
    }
}