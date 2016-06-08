using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using EsFiddleweb.Models;
using EsFiddleweb.Models.Helpers;

namespace EsFiddleweb.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [HttpPost]
        public ActionResult RunQuery(RunQueryParameters parameters)
        {
            const string indexName = "testindex";

            string opResult = string.Empty;

            opResult = ElasticSearch.DeleteIndex(indexName);
            opResult = ElasticSearch.CreateIndex(indexName);
            opResult = ElasticSearch.CreateMapping(indexName, "test", parameters.Mapping);
            opResult = ElasticSearch.InsertDocument(indexName, "test", parameters.Documents, true);
            
            Thread.Sleep(2000);

            var response = ElasticSearch.RunSearch(indexName, "test", parameters.Query);

            return Content(JsonSerialization.Serialize(new {
                queryResult = response
            }));
        }

        public class RunQueryParameters
        {
            public string Mapping { get; set; }
            public string Documents { get; set; }
            public string Query { get; set; }
        }
    }
}