using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using WebApplication1.Models.Locations;

namespace WebApplication1.Controllers
{
    public class LocationsController : Controller
    {
        private readonly ILogger<LocationsController> _logger;
        private readonly IConfiguration _config;

        public LocationsController(ILogger<LocationsController> logger,
                              IConfiguration config)
        {
            _logger = logger;
            _config = config;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Search(string q)
        {
            LocationsModel locationsInfo = new LocationsModel();
            string Baseurl = "https://localhost:44326/";
            var loactionsResponse = "";
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
                    HttpResponseMessage Res = await client.GetAsync("https://developers.zomato.com/api/v2.1/locations?q=" + q + "&lat=" + latitude + "&lon=" + longitude);
                    //Checking the response is successful or not which is sent using HttpClient  
                    if (Res.IsSuccessStatusCode)
                    {
                        //Storing the response details recieved from web api   
                        loactionsResponse = Res.Content.ReadAsStringAsync().Result;
                        //Deserializing the response recieved from web api and storing into the Model
                        locationsInfo = JsonConvert.DeserializeObject<LocationsModel>(loactionsResponse);
                    }
                }
            }
            return View(locationsInfo);
        }

        public async Task<IActionResult> LocationDetails(string entity_id, string entity_type)
        {
            LocationDetailsModel locationsInfo = new LocationDetailsModel();
            string Baseurl = "https://localhost:44326/";
            var loactionsResponse = "";
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
                    HttpResponseMessage Res = await client.GetAsync("https://developers.zomato.com/api/v2.1/location_details?entity_id=" + entity_id + "&entity_type=" + entity_type);
                    //Checking the response is successful or not which is sent using HttpClient  
                    if (Res.IsSuccessStatusCode)
                    {
                        //Storing the response details recieved from web api   
                        loactionsResponse = Res.Content.ReadAsStringAsync().Result;
                        //Deserializing the response recieved from web api and storing into the Model
                        locationsInfo = JsonConvert.DeserializeObject<LocationDetailsModel>(loactionsResponse);
                    }
                }
            }
            return View(locationsInfo);
        }
    }
}
