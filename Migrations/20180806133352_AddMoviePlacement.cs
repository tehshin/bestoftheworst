using Microsoft.EntityFrameworkCore.Migrations;

namespace bestoftheworst.Migrations
{
    public partial class AddMoviePlacement : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Placement",
                table: "Movies",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Placement",
                table: "Movies");
        }
    }
}
