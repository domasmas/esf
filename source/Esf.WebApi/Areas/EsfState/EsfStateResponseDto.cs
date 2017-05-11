namespace Esf.WebApi.Areas.EsfState
{
    public class EsfStateResponseDto
    {
        public ExistingEsfStateDto EsfState { get; set; }
        public string Error { get; set; }
        public bool Success { get; set; }
    }
}