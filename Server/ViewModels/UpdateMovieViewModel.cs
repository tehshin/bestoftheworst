using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BestOfTheWorst.Server.ViewModels
{
    public class UpdateMovieViewModel
    {
        [Required]
        public string Title { get; set; }

        public string Synopsis { get; set; }
    }
}