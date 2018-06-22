namespace BestOfTheWorst.Server.Models
{
    public class Link
    {
        public long Id { get; set; }

        public long MovieId { get; set; }

        public int LinkType { get; set; }

        public string Href { get; set; }
    }
}