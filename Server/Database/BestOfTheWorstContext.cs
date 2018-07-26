using BestOfTheWorst.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BestOfTheWorst.Server.Database
{
    public class BestOfTheWorstContext : IdentityDbContext<AppUser>
    {
        public BestOfTheWorstContext(DbContextOptions<BestOfTheWorstContext> options) : base(options) { }

        public DbSet<Movie> Movies { get; set; }

        public DbSet<Tag> Tags { get; set; }

        public DbSet<Image> Images { get; set; }

        public DbSet<Episode> Episodes { get; set; }

        public DbSet<Link> Links { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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

            modelBuilder.Entity<MovieGenre>()
                .HasKey(mg => new { mg.MovieId, mg.GenreId });

            modelBuilder.Entity<MovieGenre>()
                .HasOne(mg => mg.Movie)
                .WithMany()
                .HasForeignKey(mg => mg.MovieId);

            modelBuilder.Entity<MovieGenre>()
                .HasOne(mg => mg.Genre)
                .WithMany()
                .HasForeignKey(mg => mg.GenreId);

            modelBuilder.Entity<Movie>()
                .Ignore(m => m.Tags)
                .Ignore(m => m.Genres);
        }
    }
}