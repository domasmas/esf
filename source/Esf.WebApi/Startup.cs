﻿using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Esf.WebApi.Startup))]

namespace Esf.WebApi
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
