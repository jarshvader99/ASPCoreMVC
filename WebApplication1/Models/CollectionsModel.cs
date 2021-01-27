using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace WebApplication1.Models
{

    public class Rootobject
    {
        public Collection[] collections { get; set; }
        public int has_more { get; set; }
        public string share_url { get; set; }
        public string display_text { get; set; }
        public int has_total { get; set; }
        public bool user_has_addresses { get; set; }

        public string title { get; set; }
        public string description { get; set; }
    }

    public class Collection
    {
        public Collection1 collection { get; set; }
    }

    public class Collection1
    {
        public int collection_id { get; set; }
        public int res_count { get; set; }
        public string image_url { get; set; }
        public string url { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string share_url { get; set; }
    }

}
