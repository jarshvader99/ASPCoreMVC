using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Models.Locations
{

    public class LocationDetailsModel
    {
        public string popularity { get; set; }
        public string nightlife_index { get; set; }
        public string[] nearby_res { get; set; }
        public string[] top_cuisines { get; set; }
        public string popularity_res { get; set; }
        public string nightlife_res { get; set; }
        public string subzone { get; set; }
        public int subzone_id { get; set; }
        public string city { get; set; }
        public Location location { get; set; }
        public int num_restaurant { get; set; }
        public Best_Rated_Restaurant[] best_rated_restaurant { get; set; }
    }

    public class Location
    {
        public string entity_type { get; set; }
        public int entity_id { get; set; }
        public string title { get; set; }
        public float latitude { get; set; }
        public float longitude { get; set; }
        public int city_id { get; set; }
        public string city_name { get; set; }
        public int country_id { get; set; }
        public string country_name { get; set; }
    }

    public class Best_Rated_Restaurant
    {
        public Restaurant restaurant { get; set; }
    }

    public class Restaurant
    {
        public R R { get; set; }
        public string apikey { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public string url { get; set; }
        public Location1 location { get; set; }
        public int switch_to_order_menu { get; set; }
        public string cuisines { get; set; }
        public string timings { get; set; }
        public int average_cost_for_two { get; set; }
        public int price_range { get; set; }
        public string currency { get; set; }
        public string[] highlights { get; set; }
        public object[] offers { get; set; }
        public int opentable_support { get; set; }
        public int is_zomato_book_res { get; set; }
        public string mezzo_provider { get; set; }
        public int is_book_form_web_view { get; set; }
        public string book_form_web_view_url { get; set; }
        public string book_again_url { get; set; }
        public string thumb { get; set; }
        public User_Rating user_rating { get; set; }
        public int all_reviews_count { get; set; }
        public string photos_url { get; set; }
        public int photo_count { get; set; }
        public string menu_url { get; set; }
        public string featured_image { get; set; }
        public bool medio_provider { get; set; }
        public int has_online_delivery { get; set; }
        public int is_delivering_now { get; set; }
        public string store_type { get; set; }
        public bool include_bogo_offers { get; set; }
        public string deeplink { get; set; }
        public int is_table_reservation_supported { get; set; }
        public int has_table_booking { get; set; }
        public string events_url { get; set; }
        public string phone_numbers { get; set; }
        public All_Reviews all_reviews { get; set; }
        public string[] establishment { get; set; }
    }

    public class R
    {
        public int res_id { get; set; }
        public bool is_grocery_store { get; set; }
        public Has_Menu_Status has_menu_status { get; set; }
    }

    public class Has_Menu_Status
    {
        public int delivery { get; set; }
        public int takeaway { get; set; }
    }

    public class Location1
    {
        public string address { get; set; }
        public string locality { get; set; }
        public string city { get; set; }
        public int city_id { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }
        public string zipcode { get; set; }
        public int country_id { get; set; }
        public string locality_verbose { get; set; }
    }

    public class User_Rating
    {
        public string aggregate_rating { get; set; }
        public string rating_text { get; set; }
        public string rating_color { get; set; }
        public Rating_Obj rating_obj { get; set; }
        public int votes { get; set; }
    }

    public class Rating_Obj
    {
        public Title title { get; set; }
        public Bg_Color bg_color { get; set; }
    }

    public class Title
    {
        public string text { get; set; }
    }

    public class Bg_Color
    {
        public string type { get; set; }
        public string tint { get; set; }
    }

    public class All_Reviews
    {
        public Review[] reviews { get; set; }
    }

    public class Review
    {
        public object[] review { get; set; }
    }

}
