using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WorkoutAPI.Models;

namespace WorkoutAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<UserModel>
    {
        public DbSet<ActivityModel> Activities { get; set; }
        public DbSet<WorkoutModel> Workouts { get; set; }
        public DbSet<ExerciseModel> Exercises { get; set; }
        public DbSet<UserModel> Users { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            SeedActivities(builder);
        }

        private void SeedActivities(ModelBuilder builder)
        {
            ActivityModel activity = new ActivityModel()
            {
                ID = 69,
                Name = "Placeholder",
                Description = "This Activity is for Testing",
                Type = "Test",
                UserID = "HELLOWORLD"
            };

            builder.Entity<ActivityModel>().HasData(activity);
        }
    }
}
