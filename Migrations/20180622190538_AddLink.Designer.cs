﻿// <auto-generated />
using System;
using BestOfTheWorst.Server.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace bestoftheworst.Migrations
{
    [DbContext(typeof(BestOfTheWorstContext))]
    [Migration("20180622190538_AddLink")]
    partial class AddLink
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.0-rtm-30799")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("BestOfTheWorst.Server.Models.Episode", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Title");

                    b.Property<string>("VideoId");

                    b.HasKey("Id");

                    b.ToTable("Episodes");
                });

            modelBuilder.Entity("BestOfTheWorst.Server.Models.Image", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("FileName");

                    b.Property<string>("Path");

                    b.HasKey("Id");

                    b.ToTable("Images");
                });

            modelBuilder.Entity("BestOfTheWorst.Server.Models.Link", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Href");

                    b.Property<int>("LinkType");

                    b.Property<long>("MovieId");

                    b.HasKey("Id");

                    b.HasIndex("MovieId");

                    b.ToTable("Links");
                });

            modelBuilder.Entity("BestOfTheWorst.Server.Models.Movie", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("EpisodeId");

                    b.Property<Guid?>("ImageId");

                    b.Property<string>("Synopsis");

                    b.Property<TimeSpan>("Timestamp");

                    b.Property<string>("Title");

                    b.HasKey("Id");

                    b.HasIndex("EpisodeId");

                    b.HasIndex("ImageId");

                    b.ToTable("Movies");
                });

            modelBuilder.Entity("BestOfTheWorst.Server.Models.MovieTag", b =>
                {
                    b.Property<long>("MovieId");

                    b.Property<long>("TagId");

                    b.HasKey("MovieId", "TagId");

                    b.HasIndex("TagId");

                    b.ToTable("MovieTag");
                });

            modelBuilder.Entity("BestOfTheWorst.Server.Models.Tag", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("BestOfTheWorst.Server.Models.Link", b =>
                {
                    b.HasOne("BestOfTheWorst.Server.Models.Movie")
                        .WithMany("Links")
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BestOfTheWorst.Server.Models.Movie", b =>
                {
                    b.HasOne("BestOfTheWorst.Server.Models.Episode", "Episode")
                        .WithMany()
                        .HasForeignKey("EpisodeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BestOfTheWorst.Server.Models.Image", "Image")
                        .WithMany()
                        .HasForeignKey("ImageId");
                });

            modelBuilder.Entity("BestOfTheWorst.Server.Models.MovieTag", b =>
                {
                    b.HasOne("BestOfTheWorst.Server.Models.Movie", "Movie")
                        .WithMany()
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BestOfTheWorst.Server.Models.Tag", "Tag")
                        .WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
