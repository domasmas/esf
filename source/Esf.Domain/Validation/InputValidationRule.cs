namespace Esf.Domain.Validation
{
    public interface InputValidationRule
    {
        InputValidationResponse Validate(string fieldName, string input);
    }
}