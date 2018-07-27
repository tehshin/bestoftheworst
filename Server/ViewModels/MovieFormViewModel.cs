using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BestOfTheWorst.Server.ViewModels
{
    public class MovieFormViewModel
    {
        [Required]
        public string Title { get; set; }

        public string Overview { get; set; }

        public DateTime? ReleaseDate { get; set; }

        public int Runtime { get; set; }

        public string Synopsis { get; set; }

        public IList<string> Tags { get; set; } = new List<string>();

        public IList<LinkViewModel> Links { get; set; } = new List<LinkViewModel>();

        public IList<GenreViewModel> Genres { get; set; } = new List<GenreViewModel>();

        public Guid? Image { get; set; }

        [Required]
        public long EpisodeId { get; set; }
    }
}