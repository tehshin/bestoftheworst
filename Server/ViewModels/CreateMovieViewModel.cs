using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BestOfTheWorst.Server.ViewModels
{
    public class CreateMovieViewModel
    {
        [Required]
        public string Title { get; set; }

        public string Synopsis { get; set; }

        public IList<string> Tags { get; set; } = new List<string>();

        public Guid? Image { get; set; }

        [Required]
        public long EpisodeId { get; set; }
    }
}