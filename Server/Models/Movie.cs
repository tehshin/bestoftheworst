using System.Collections.Generic;

namespace BestOfTheWorst.Server.Models
{
    public class Movie
    {
        public long Id { get; set; }

        public string Title { get; set; }

        public string Synopsis { get; set; }

        public IList<Tag> Tags { get; set; } = new List<Tag>();
    }
}