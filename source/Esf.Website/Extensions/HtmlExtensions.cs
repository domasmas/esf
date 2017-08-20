using Microsoft.AspNetCore.Mvc.Rendering;

namespace Esf.Website.Extensions
{
    public static class HtmlExtensions
    {
        public static bool IsDebug(this IHtmlHelper<dynamic> htmlHelper)
        {
#if DEBUG
            return true;
#else
      return false;
#endif
        }
    }
}