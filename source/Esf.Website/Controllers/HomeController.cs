﻿using Microsoft.AspNetCore.Mvc;

namespace Esf.Website.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}