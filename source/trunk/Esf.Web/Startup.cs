using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Esf.Web.Startup))]
namespace Esf.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            
        }
    }
}
