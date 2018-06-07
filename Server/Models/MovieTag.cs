namespace BestOfTheWorst.Server.Models
{
    public class MovieTag
    {
        public long MovieId { get; set; }

        public Movie Movie { get; set; }

        public long TagId { get; set; }

        public Tag Tag { get; set; }
    }
}