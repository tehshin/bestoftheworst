using System.Collections.Generic;

namespace BestOfTheWorst.Server.ViewModels
{
    public class MovieListViewModel
    {
        public class MovieInfo
        {
            public long Id { get; set; }

            public string Title { get; set; }

            public ImageViewModel Image { get; set; }
        }

        public class PagingInfo
        {
            public int PageIndex { get; set; }

            public int PageSize { get; set; }

            public int TotalPages { get; set; }

            public int TotalItems { get; set; }
        }
        
        public PagingInfo Paging { get; set; }

        public IEnumerable<MovieInfo> Items { get; set; } = new List<MovieInfo>();
    }
}