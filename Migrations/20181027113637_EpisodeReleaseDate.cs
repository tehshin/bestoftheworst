using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace bestoftheworst.Migrations
{
    public partial class EpisodeReleaseDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ReleaseDate",
                table: "Episodes",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReleaseDate",
                table: "Episodes");
        }
    }
}
