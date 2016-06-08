using System;
using System.Diagnostics;
using System.Net.Http;
using System.Threading;
using EsFiddleweb.Models.Helpers;

namespace EsFiddleweb.Models
{
    public static class ElasticSearch
    {
        public static string DeleteIndex(string indexName)
        {
            var response = Delete(indexName);
            return response;
        }

        public static string CreateIndex(string indexName)
        {
            var response = Put(indexName, 
                JsonSerialization.Serialize(new {
                    settings = new {
                        index = new {
                            number_of_shards = 1
                        }
                    }
                }));

            return response;
        }

        public static string CreateMapping(string indexName, string type, string mapping)
        {
            var response = Put(indexName + "/_mapping/" + type + "/", mapping);
            return response;
        }

        public static string InsertDocument(string indexName, string type, string document, bool blocking = false)
        {
            var response = Put(indexName + "/" + type + "/1", document);
            if (blocking)
            {
                var sw = new Stopwatch();
                sw.Start();

                while (sw.Elapsed < TimeSpan.FromSeconds(20))
                {
                    var searchResponse = Get(indexName + "/" + type + "/1");
                    if (searchResponse.Contains("\"found\":true"))
                    {
                        break;
                    }
                    Thread.Sleep(500);
                }
            }
            return response;
        }

        public static string RunSearch(string indexName, string type, string query)
        {
            var response = Post(indexName + "/" + type + "/_search", query);
            return response;
        }

        private static string Put(string relUrl, string body)
        {
            using (HttpClient client = new HttpClient())
            using (HttpResponseMessage response = client.PutAsync("http://localhost:9200/" + relUrl, new StringContent(body)).Result)
            using (HttpContent content = response.Content)
            {
                string result = content.ReadAsStringAsync().Result;

                return result;
            }
        }

        private static string Post(string relUrl, string body)
        {
            using (HttpClient client = new HttpClient())
            using (HttpResponseMessage response = client.PostAsync("http://localhost:9200/" + relUrl, new StringContent(body)).Result)
            using (HttpContent content = response.Content)
            {
                string result = content.ReadAsStringAsync().Result;

                return result;
            }
        }

        private static string Get(string relUrl)
        {
            using (HttpClient client = new HttpClient())
            using (HttpResponseMessage response = client.GetAsync("http://localhost:9200/" + relUrl).Result)
            using (HttpContent content = response.Content)
            {
                string result = content.ReadAsStringAsync().Result;

                return result;
            }
        }

        private static string Delete(string relUrl)
        {
            using (HttpClient client = new HttpClient())
            using (HttpResponseMessage response = client.DeleteAsync("http://localhost:9200/" + relUrl).Result)
            using (HttpContent content = response.Content)
            {
                string result = content.ReadAsStringAsync().Result;

                return result;
            }
        }
    }
}