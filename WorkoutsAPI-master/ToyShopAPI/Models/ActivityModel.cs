using System;
using System.ComponentModel.DataAnnotations;

namespace WorkoutAPI.Models
{
    public class ActivityModel
    {
        [Key]
        [Required]
        public int ID { get; set; }

        [MaxLength(150)]
        [Required]
        public string? Name { get; set; }

        [MaxLength(150)]
        [Required]
        public string? Description { get; set; }

        [MaxLength(50)]
        [Required]
        public string? Type { get; set; }
    }
}
