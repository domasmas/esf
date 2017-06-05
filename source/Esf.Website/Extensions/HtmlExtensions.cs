
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace Esf.Website.Extensions
{
    public static class HtmlExtensionss
    {
        public static bool IsDebug(this HtmlHelper htmlHelper)
        {
#if DEBUG
            return true;
#else
      return false;
#endif
        }
    }
}