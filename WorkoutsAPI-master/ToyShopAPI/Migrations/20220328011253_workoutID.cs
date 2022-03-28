using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkoutAPI.Migrations
{
    public partial class workoutID : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserID",
                table: "Exercises");

            migrationBuilder.AddColumn<string>(
                name: "UserID",
                table: "Workouts",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "Activities",
                columns: new[] { "ID", "Description", "Name", "Type", "UserID" },
                values: new object[] { 69, "This Activity is for Testing", "Placeholder", "Test", "HELLOWORLD" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "ID",
                keyValue: 69);

            migrationBuilder.DropColumn(
                name: "UserID",
                table: "Workouts");

            migrationBuilder.AddColumn<string>(
                name: "UserID",
                table: "Exercises",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
