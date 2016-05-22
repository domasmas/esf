using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(EsFiddleweb.Startup))]
namespace EsFiddleweb
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
