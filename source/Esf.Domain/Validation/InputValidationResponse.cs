namespace Esf.Domain.Validation
{
    public class InputValidationResponse
    {
        public bool IsValid { get; set; }
        public string ErrorMessage { get; set; }
    }
}