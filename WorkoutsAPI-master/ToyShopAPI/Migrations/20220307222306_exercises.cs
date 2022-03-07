using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkoutAPI.Migrations
{
    public partial class exercises : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Workouts_Activities_ActivityID",
                table: "Workouts");

            migrationBuilder.DropIndex(
                name: "IX_Workouts_ActivityID",
                table: "Workouts");

            migrationBuilder.DropColumn(
                name: "ActivityID",
                table: "Workouts");

            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Workouts");

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

            migrationBuilder.AddColumn<DateTime>(
                name: "WorkoutCreated",
                table: "Workouts",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "Exercises",
                columns: table => new
                {
                    ID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ActivityID = table.Column<int>(type: "INTEGER", nullable: false),
                    WorkoutID = table.Column<int>(type: "INTEGER", nullable: false),
                    Duration = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exercises", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Exercises_Activities_ActivityID",
                        column: x => x.ActivityID,
                        principalTable: "Activities",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_ActivityID",
                table: "Exercises",
                column: "ActivityID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Exercises");

            migrationBuilder.DropColumn(
                name: "LocationLatitude",
                table: "Workouts");

            migrationBuilder.DropColumn(
                name: "LocationLongitude",
                table: "Workouts");

            migrationBuilder.DropColumn(
                name: "WorkoutCreated",
                table: "Workouts");

            migrationBuilder.AddColumn<int>(
                name: "ActivityID",
                table: "Workouts",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "Duration",
                table: "Workouts",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateIndex(
                name: "IX_Workouts_ActivityID",
                table: "Workouts",
                column: "ActivityID");

            migrationBuilder.AddForeignKey(
                name: "FK_Workouts_Activities_ActivityID",
                table: "Workouts",
                column: "ActivityID",
                principalTable: "Activities",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
