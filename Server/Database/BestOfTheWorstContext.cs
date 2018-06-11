using BestOfTheWorst.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace BestOfTheWorst.Server.Database
{
    public class BestOfTheWorstContext : DbContext
    {
        public BestOfTheWorstContext(DbContextOptions<BestOfTheWorstContext> options) : base(options)
        {
            
        }

        public DbSet<Movie> Movies { get; set; }

        public DbSet<Tag> Tags { get; set; }

        public DbSet<Image> Images { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MovieTag>()
                .HasKey(mt => new { mt.MovieId, mt.TagId });

            modelBuilder.Entity<MovieTag>()
                .HasOne(mt => mt.Movie)
                .WithMany()
                .HasForeignKey(mt => mt.MovieId);

            modelBuilder.Entity<MovieTag>()
                .HasOne(mt => mt.Tag)
                .WithMany()
                .HasForeignKey(mt => mt.TagId);

            modelBuilder.Entity<Movie>()
                .Ignore(m => m.Tags);
        }
    }
}