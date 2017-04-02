namespace Esf.WebApi.Areas.EsfQueryRunner
{
    public class EsfRunResponseDto
    {
        public bool IsSuccess { get; set; }
        public string SuccessJsonResult { get; set; }
        public JsonErrorDto JsonValidationError { get; set; }
        public EsfErrorDto ElasticsearchError { get; set; }
    }
}