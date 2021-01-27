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
using WebApplication1.Models;
using WebApplication1.Models.Geocode;

namespace WebApplication1.Controllers
{
    public class GeocodeController : Controller
    {
        private readonly ILogger<GeocodeController> _logger;
        private readonly IConfiguration _config;

        public GeocodeController(ILogger<GeocodeController> logger,
                              IConfiguration config)
        {
            _logger = logger;
            _config = config;
        }
        
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            GeocodeModel geocodeInfo = new GeocodeModel();
            string Baseurl = "https://localhost:44326/";
            var geocodeResponse = "";
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
                    HttpResponseMessage Res = await client.GetAsync("https://developers.zomato.com/api/v2.1/geocode?lat=" + latitude + "&lon=" + longitude);
                    //Checking the response is successful or not which is sent using HttpClient  
                    if (Res.IsSuccessStatusCode)
                    {
                        //Storing the response details recieved from web api   
                        geocodeResponse = Res.Content.ReadAsStringAsync().Result;
                        //Deserializing the response recieved from web api and storing into the Model
                        geocodeInfo = JsonConvert.DeserializeObject<GeocodeModel>(geocodeResponse);
                    }
                }
            }
            return View(geocodeInfo);
        }
    }
}
