using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorkoutAPI.Models
{
    public class ExerciseModel
    {
        [Key]
        public int ID { get; set; }

        public int ActivityID { get; set; }

        [ForeignKey("ActivityID")]
        public ActivityModel? Activity { get; set; }

        [Required]
        public int WorkoutID { get; set; }

        [Required]
        public double? Duration { get; set; }
    }
}
