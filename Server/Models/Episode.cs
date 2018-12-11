using System;

namespace BestOfTheWorst.Server.Models
{
    public class Episode
    {
        public long Id { get; set; }

        public string Title { get; set; }

        public string VideoId { get; set; }

        public DateTime? ReleaseDate { get; set; }
    }
}