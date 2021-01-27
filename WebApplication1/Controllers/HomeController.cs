using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SpotifyAPI.Web;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _config;

        public HomeController(ILogger<HomeController> logger,
                              IConfiguration config)
        {
            _logger = logger;
            _config = config;
        }

        //[Authorize]
        public IActionResult Index()
        {
            //var zomatoApiKey = _config["ZomatoApiKey"];
            //var latitude = HttpContext.Session.GetString("latitude");
            //var longitude = HttpContext.Session.GetString("longitude");
            //Rootobject collectionsInfo = new Rootobject();
            //string Baseurl = "https://localhost:44326/";
            //var collectionsResponse = "";
            //if(latitude == null && longitude == null)
            //{
            //    latitude = "39.0385122";
            //    longitude = "-94.3975219";
            //}
            //if (latitude != null && longitude != null) 
            //{ 
            //    using (var client = new HttpClient())
            //    {
            //        //Passing service base url  
            //        client.BaseAddress = new Uri(Baseurl);

            //        client.DefaultRequestHeaders.Clear();
            //        //Define request data format  
            //        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            //        client.DefaultRequestHeaders.Add("user-key", zomatoApiKey);

            //        //Sending request to find web api REST service resource using HttpClient  
            //        HttpResponseMessage Res = await client.GetAsync("https://developers.zomato.com/api/v2.1/collections?" + "lat=" + latitude + "&lon=" + longitude);

            //        //Checking the response is successful or not which is sent using HttpClient  
            //        if (Res.IsSuccessStatusCode)
            //        {
            //            //Storing the response details recieved from web api   
            //            collectionsResponse = Res.Content.ReadAsStringAsync().Result;

            //            //Deserializing the response recieved from web api and storing into the collections Model

            //            collectionsInfo = JsonConvert.DeserializeObject<Rootobject>(collectionsResponse);

            //        }
            //    }
            //}
            return View();
        }

        [HttpPost]
        public JsonResult StoreUserLocation(string latitude, string longitude)
        {
            HttpContext.Session.SetString("latitude", latitude);
            HttpContext.Session.SetString("longitude", longitude);
            JsonResult result = new JsonResult("success");
            return Json(result);
        }

        [HttpGet]
        public JsonResult GetUserLocation(string latitude, string longitude)
        {
            var lat = HttpContext.Session.GetString("latitude");
            var lon = HttpContext.Session.GetString("longitude");
            JsonResult result;
            if (lat != null && lon != null)
            {
               result = new JsonResult("success");
            }
            else
            {
                result = new JsonResult("failed");
            }
            return Json(result);
        }

        public async Task<IActionResult> Search(string q, string sort, string order, string start)
        {
            SearchModel searchInfo = new SearchModel();
            string Baseurl = "https://localhost:44326/";
            var searchResponse = "";
            var zomatoApiKey = _config["ZomatoApiKey"];
            var latitude = HttpContext.Session.GetString("latitude");
            var longitude = HttpContext.Session.GetString("longitude");
            if (latitude != null && longitude != null)
            {
                using (var client = new HttpClient())
                {
                    //Passing service base url  
                    client.BaseAddress = new Uri(Baseurl);

                    client.DefaultRequestHeaders.Clear();
                    //Define request data format  
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("user-key", zomatoApiKey);

                    //Sending request to find web api REST service resource using HttpClient  
                    HttpResponseMessage Res = await client.GetAsync("https://developers.zomato.com/api/v2.1/search?q=" + q + "&lat=" + latitude + "&lon=" + longitude + "&sort=" + sort + "&order=" + order + "&start=" + start);

                    //Checking the response is successful or not which is sent using HttpClient  
                    if (Res.IsSuccessStatusCode)
                    {
                        //Storing the response details recieved from web api   
                        searchResponse = Res.Content.ReadAsStringAsync().Result;

                        //Deserializing the response recieved from web api and storing into the collections Model

                        searchInfo = JsonConvert.DeserializeObject<SearchModel>(searchResponse);

                    }
                }
            }
            return View(searchInfo);
        }
        [HttpGet]
        public async Task<JsonResult> SearchMore(string q, string sort, string order, string start)
        {
            SearchModel searchInfo = new SearchModel();
            string Baseurl = "https://localhost:44326/";
            var searchResponse = "";
            var zomatoApiKey = _config["ZomatoApiKey"];
            var latitude = HttpContext.Session.GetString("latitude");
            var longitude = HttpContext.Session.GetString("longitude");
            if (latitude != null && longitude != null)
            {
                using (var client = new HttpClient())
                {
                    //Passing service base url  
                    client.BaseAddress = new Uri(Baseurl);
                    client.DefaultRequestHeaders.Clear();
                    //Define request data format  
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("user-key", zomatoApiKey);
                    //Sending request to find web api REST service resource using HttpClient  
                    HttpResponseMessage Res = await client.GetAsync("https://developers.zomato.com/api/v2.1/search?q=" + q + "&lat=" + latitude + "&lon=" + longitude + "&sort=" + sort + "&order=" + order + "&start=" + start);
                    //Checking the response is successful or not which is sent using HttpClient  
                    if (Res.IsSuccessStatusCode)
                    {
                        //Storing the response details recieved from web api   
                        searchResponse = Res.Content.ReadAsStringAsync().Result;
                        //Deserializing the response recieved from web api and storing into the collections Model
                        searchInfo = JsonConvert.DeserializeObject<SearchModel>(searchResponse);
                    }
                }
            }
            return Json(searchInfo);
        }

       
        public async Task<IActionResult> Collections()
        {
            Rootobject collectionsInfo = new Rootobject();
            string Baseurl = "https://localhost:44326/";
            var collectionsResponse = "";
            var zomatoApiKey = _config["ZomatoApiKey"];
            var latitude = HttpContext.Session.GetString("latitude");
            var longitude = HttpContext.Session.GetString("longitude");
            if (latitude != null && longitude != null)
            {
                using (var client = new HttpClient())
                {
                    //Passing service base url  
                    client.BaseAddress = new Uri(Baseurl);

                    client.DefaultRequestHeaders.Clear();
                    //Define request data format  
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("user-key", zomatoApiKey);

                    //Sending request to find web api REST service resource using HttpClient  
                    HttpResponseMessage Res = await client.GetAsync("https://developers.zomato.com/api/v2.1/collections?" + "lat=" + latitude + "&lon=" + longitude);

                    //Checking the response is successful or not which is sent using HttpClient  
                    if (Res.IsSuccessStatusCode)
                    {
                        //Storing the response details recieved from web api   
                        collectionsResponse = Res.Content.ReadAsStringAsync().Result;

                        //Deserializing the response recieved from web api and storing into the collections Model

                        collectionsInfo = JsonConvert.DeserializeObject<Rootobject>(collectionsResponse);

                    }
                }
            }
            return View(collectionsInfo);
        }

        public class Pos
        {
            public string Latitude
            {
                get;
                set;
            }
            public string Longitude
            {
                get;
                set;
            }
        }

        public IActionResult spotify()
        {
            IConfigurationSection spotifyAuthNSection =
                _config.GetSection("Authentication:Spotify");

            //options.ClientId = spotifyAuthNSection["ClientId"];
            //options.ClientSecret = spotifyAuthNSection["ClientSecret"];
            //var spotify = new SpotifyClient("YourAccessToken");

            //var me = spotify.UserProfile.Current();

            //var spotifyUser = new SpotifyUserModel
            //{
            //    Id = me.Result.Id,
            //    display_name = me.Result.DisplayName

            //};
            //ViewBag.Message = spotifyUser;

            
            return View();
        }
        //[Authorize]
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
