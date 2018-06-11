using System;

namespace BestOfTheWorst.Server.Models
{
    public class Image
    {
        public Guid Id { get; set; }

        public string FileName { get; set; }

        public string Path { get; set; }
    }
}