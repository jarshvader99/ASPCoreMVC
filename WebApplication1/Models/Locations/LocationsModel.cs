using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Models.Locations
{
    public class LocationsModel
    {
        public Location_Suggestions[] location_suggestions { get; set; }
        public string status { get; set; }
        public int has_more { get; set; }
        public int has_total { get; set; }
        public bool user_has_addresses { get; set; }
    }

    public class Location_Suggestions
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

}
