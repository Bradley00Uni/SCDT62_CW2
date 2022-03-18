using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkoutAPI.Migrations
{
    public partial class removelocation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationLatitude",
                table: "Workouts");

            migrationBuilder.DropColumn(
                name: "LocationLongitude",
                table: "Workouts");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LocationLatitude",
                table: "Workouts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LocationLongitude",
                table: "Workouts",
                type: "TEXT",
                nullable: true);
        }
    }
}
