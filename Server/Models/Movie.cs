
using System;
using System.Collections.Generic;

namespace BestOfTheWorst.Server.Models
{
    public class Movie
    {
        public long Id { get; set; }

        public string Title { get; set; }

        public string Overview { get; set; }

        public string Synopsis { get; set; }

        public DateTime? ReleaseDate { get; set; }

        public int Runtime { get; set; }

        public Guid? ImageId { get; set; }

        public Image Image { get; set; }

        public long EpisodeId { get; set; }

        public Episode Episode { get; set; }

        public TimeSpan Timestamp { get; set; }

        public IList<Tag> Tags { get; set; } = new List<Tag>();

        public IList<Link> Links { get; set; } = new List<Link>();

        public IList<Genre> Genres { get; set; } = new List<Genre>();
    }
}