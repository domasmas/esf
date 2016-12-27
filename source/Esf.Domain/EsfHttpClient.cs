using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Esf.Domain
{
    public interface IEsfHttpClient
    {
        Task<string> Get(params string[] relUrlParts);
        Task<string> Post(string body, params string[] relUrlParts);
        Task<string> Put(string body, params string[] relUrlParts);
        Task<string> Delete(params string[] relUrlParts);
    }

    public class EsfHttpClient : IEsfHttpClient
    {
        protected readonly Uri host;

        public EsfHttpClient(Uri host)
        {
            this.host = host;
        }

        public async Task<string> Delete(params string[] relUrlParts)
        {
            var fullUri = new Uri(host, PartsToUri(relUrlParts));

            using (HttpClient client = new HttpClient())
            using (HttpResponseMessage response = await client.DeleteAsync(fullUri))
            using (HttpContent content = response.Content)
            {
                return await content.ReadAsStringAsync();
            }
        }

        public async Task<string> Get(params string[] relUrlParts)
        {
            var fullUri = new Uri(host, PartsToUri(relUrlParts));

            using (HttpClient client = new HttpClient())
            using (HttpResponseMessage response = await client.GetAsync(fullUri))
            using (HttpContent content = response.Content)
            {
                return await content.ReadAsStringAsync();
            }
        }

        public async Task<string> Post(string body, params string[] relUrlParts)
        {
            var fullUri = new Uri(host, PartsToUri(relUrlParts));
            var bodyContent = new StringContent(body);

            using (HttpClient client = new HttpClient())
            using (HttpResponseMessage response = await client.PostAsync(fullUri, bodyContent))
            using (HttpContent content = response.Content)
            {
                return await content.ReadAsStringAsync();
            }
        }

        public async Task<string> Put(string body, params string[] relUrlParts)
        {
            var fullUri = new Uri(host, PartsToUri(relUrlParts));
            var bodyContent = new StringContent(body);

            using (HttpClient client = new HttpClient())
            using (HttpResponseMessage response = await client.PutAsync(fullUri, bodyContent))
            using (HttpContent content = response.Content)
            {
                var stringResponse = await content.ReadAsStringAsync();
                return stringResponse;
            }
        }

        private static Uri PartsToUri(string[] uriParts)
        {
            return new Uri($"/{String.Join("/", uriParts.Select(x => x.Trim('/')))}", UriKind.Relative);
        }
    }
}
