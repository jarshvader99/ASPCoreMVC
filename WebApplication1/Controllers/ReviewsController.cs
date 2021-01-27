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
using WebApplication1.Models.Geocode;
using WebApplication1.Models.Reviews;

namespace WebApplication1.Controllers
{
    public class ReviewsController : Controller
    {
        private readonly ILogger<ReviewsController> _logger;
        private readonly IConfiguration _config;

        public ReviewsController(ILogger<ReviewsController> logger,
                              IConfiguration config)
        {
            _logger = logger;
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> Index(string res_id)
        {
            ReviewsModel reviewsInfo = new ReviewsModel();
            string Baseurl = "https://localhost:44326/";
            var reviewsResponse = "";
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
                    HttpResponseMessage Res = await client.GetAsync("https://developers.zomato.com/api/v2.1/reviews?res_id=" + res_id);
                    //Checking the response is successful or not which is sent using HttpClient  
                    if (Res.IsSuccessStatusCode)
                    {
                        //Storing the response details recieved from web api   
                        reviewsResponse = Res.Content.ReadAsStringAsync().Result;
                        //Deserializing the response recieved from web api and storing into the Model
                        reviewsInfo = JsonConvert.DeserializeObject<ReviewsModel>(reviewsResponse);
                    }
                }
            }
            return View(reviewsInfo);
        }
    }
}
