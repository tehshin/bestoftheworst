namespace BestOfTheWorst.Server.Models
{
    public class MovieGenre
    {
        public long MovieId { get; set; }

        public Movie Movie { get; set; }

        public long GenreId { get; set; }

        public Genre Genre { get; set; }
    }
}