using System;
using System.ComponentModel.DataAnnotations;

namespace BestOfTheWorst.Server.ViewModels
{
    public class CreateEpisodeViewModel
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string VideoId { get; set; }

        public DateTime? ReleaseDate { get; set; }
    }
}