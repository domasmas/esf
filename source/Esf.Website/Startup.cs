using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Esf.Website.Startup))]
namespace Esf.Website
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            
        }
    }
}
