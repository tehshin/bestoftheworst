using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace bestoftheworst.Migrations
{
    public partial class AddEpisodes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "EpisodeId",
                table: "Movies",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "Timestamp",
                table: "Movies",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.CreateTable(
                name: "Episodes",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(nullable: true),
                    VideoId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Episodes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Movies_EpisodeId",
                table: "Movies",
                column: "EpisodeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Movies_Episodes_EpisodeId",
                table: "Movies",
                column: "EpisodeId",
                principalTable: "Episodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movies_Episodes_EpisodeId",
                table: "Movies");

            migrationBuilder.DropTable(
                name: "Episodes");

            migrationBuilder.DropIndex(
                name: "IX_Movies_EpisodeId",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "EpisodeId",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "Timestamp",
                table: "Movies");
        }
    }
}
