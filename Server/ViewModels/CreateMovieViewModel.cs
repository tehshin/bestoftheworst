using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BestOfTheWorst.Server.ViewModels
{
    public class CreateMovieViewModel
    {
        public class LinkInfo
        {
            public int LinkType { get; set; }

            public string Name { get; set; }

            public string Href { get; set; }
        }

        [Required]
        public string Title { get; set; }

        public string Synopsis { get; set; }

        public IList<string> Tags { get; set; } = new List<string>();

        public IList<LinkInfo> Links { get; set; } = new List<LinkInfo>();

        public Guid? Image { get; set; }

        [Required]
        public long EpisodeId { get; set; }
    }
}