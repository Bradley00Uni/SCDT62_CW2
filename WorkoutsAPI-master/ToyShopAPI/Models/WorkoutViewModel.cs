using System.ComponentModel.DataAnnotations;

namespace WorkoutAPI.Models
{
    public class WorkoutViewModel
    { 
        public WorkoutModel? Workout { get; set; }
        public List<ExerciseModel> Exercises { get; set; }
    }
}
