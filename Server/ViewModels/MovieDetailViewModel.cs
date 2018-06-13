using System.Collections.Generic;

namespace BestOfTheWorst.Server.ViewModels
{
    public class MovieDetailViewModel
    {
        public long Id { get; set; }

        public string Title { get; set; }

        public string Synopsis { get; set; }

        public ImageViewModel Image { get; set; }

        public IList<TagViewModel> Tags { get; set; } = new List<TagViewModel>();
    }
}