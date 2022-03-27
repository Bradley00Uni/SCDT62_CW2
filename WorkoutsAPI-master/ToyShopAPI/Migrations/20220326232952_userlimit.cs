using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkoutAPI.Migrations
{
    public partial class userlimit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ID",
                keyValue: 69);

            migrationBuilder.AddColumn<string>(
                name: "UserID",
                table: "Exercises",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserID",
                table: "Activities",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserID",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "UserID",
                table: "Activities");

            migrationBuilder.InsertData(
                table: "Activities",
                columns: new[] { "ID", "Description", "Name", "Type" },
                values: new object[] { 69, "This Activity is for Testing", "Placeholder", "Test" });
        }
    }
}
