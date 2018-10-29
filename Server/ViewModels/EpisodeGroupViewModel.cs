using System;
using System.Collections.Generic;

namespace BestOfTheWorst.Server.ViewModels
{
    public class EpisodeGroupViewModel
    {
        public class MovieInfo 
        {
            public long Id { get; set; }

            public string Title { get; set; }

            public ImageViewModel Image { get; set; }
        }

        public EpisodeViewModel Episode { get; set; }

        public IEnumerable<MovieInfo> Movies { get; set; } = new List<MovieInfo>();
    }    
}
