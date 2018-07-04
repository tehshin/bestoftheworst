using System;
using System.Collections.Generic;

namespace BestOfTheWorst.Server.ViewModels
{
    public class ImageViewModel
    {
        public Guid Id { get; set; }

        public IDictionary<int, string> ImageUrls { get; set; }
    }
}