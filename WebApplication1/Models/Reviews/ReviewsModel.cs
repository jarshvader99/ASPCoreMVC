using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Models.Reviews
{

    public class ReviewsModel
    {
        public int reviews_count { get; set; }
        public int reviews_start { get; set; }
        public int reviews_shown { get; set; }
        public User_Reviews[] user_reviews { get; set; }
    }

    public class User_Reviews
    {
        public Review review { get; set; }
    }

    public class Review
    {
        public float rating { get; set; }
        public string review_text { get; set; }
        public int id { get; set; }
        public string rating_color { get; set; }
        public string review_time_friendly { get; set; }
        public string rating_text { get; set; }
        public int timestamp { get; set; }
        public int likes { get; set; }
        public User user { get; set; }
        public int comments_count { get; set; }
    }

    public class User
    {
        public string name { get; set; }
        public string zomato_handle { get; set; }
        public string foodie_level { get; set; }
        public int foodie_level_num { get; set; }
        public string foodie_color { get; set; }
        public string profile_url { get; set; }
        public string profile_image { get; set; }
        public string profile_deeplink { get; set; }
    }

}
