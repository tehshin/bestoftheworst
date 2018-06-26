using System.Collections.Generic;

namespace BestOfTheWorst.Server.ViewModels
{
    public class MovieDetailViewModel
    {
        public class MovieInfo 
        {
            public long Id { get; set; }

            public string Title { get; set; }
        }

        public long Id { get; set; }

        public string Title { get; set; }

        public string Synopsis { get; set; }

        public ImageViewModel Image { get; set; }

        public EpisodeViewModel Episode { get; set; }

        public IList<TagViewModel> Tags { get; set; } = new List<TagViewModel>();

        public IList<LinkViewModel> Links { get; set; } = new List<LinkViewModel>();

        public IList<MovieInfo> RelatedMovies { get; set; } = new List<MovieInfo>();
    }
}