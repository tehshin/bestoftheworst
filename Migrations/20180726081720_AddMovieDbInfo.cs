using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace bestoftheworst.Migrations
{
    public partial class AddMovieDbInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Overview",
                table: "Movies",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReleaseDate",
                table: "Movies",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Runtime",
                table: "Movies",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Genre",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genre", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MovieGenre",
                columns: table => new
                {
                    MovieId = table.Column<long>(nullable: false),
                    GenreId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieGenre", x => new { x.MovieId, x.GenreId });
                    table.ForeignKey(
                        name: "FK_MovieGenre_Genre_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genre",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MovieGenre_Movies_MovieId",
                        column: x => x.MovieId,
                        principalTable: "Movies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MovieGenre_GenreId",
                table: "MovieGenre",
                column: "GenreId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MovieGenre");

            migrationBuilder.DropTable(
                name: "Genre");

            migrationBuilder.DropColumn(
                name: "Overview",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "ReleaseDate",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "Runtime",
                table: "Movies");
        }
    }
}
