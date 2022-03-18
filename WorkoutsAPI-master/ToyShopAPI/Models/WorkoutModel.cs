using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorkoutAPI.Models
{
    public class WorkoutModel
    {
        [Key]
        [Required]
        public int ID { get; set; }

        public DateTime WorkoutCreated { get; set; }
    }
}
