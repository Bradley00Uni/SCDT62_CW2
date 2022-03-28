#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkoutAPI.Data;
using WorkoutAPI.Models;

namespace WorkoutAPI.Controllers
{
    [Route("api/workouts")]
    [ApiController]
    public class WorkoutsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WorkoutsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Produc
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkoutViewModel>>> GetAllWorkouts()
        {
            var ExerciseModels = new List<ExerciseModel>();
            var Workouts = new List<WorkoutViewModel>();

            var WorkoutModels = await _context.Workouts.ToListAsync();

            if(WorkoutModels == null) { return NotFound(); }

            foreach(var model in WorkoutModels)
            {
                var workoutExercises = await _context.Exercises.Include("Activity").Where(x => x.WorkoutID == model.ID).ToListAsync();

                Workouts.Add(new WorkoutViewModel() { Workout = model, Exercises = workoutExercises });
            }
            return Workouts;
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<WorkoutViewModel>>> GetWorkouts(string id)
        {
            var ExerciseModels = new List<ExerciseModel>();
            var Workouts = new List<WorkoutViewModel>();

            var WorkoutModels = await _context.Workouts.Where(u => u.UserID == id).ToListAsync();

            if (WorkoutModels == null) { return NotFound(); }

            foreach (var model in WorkoutModels)
            {
                var workoutExercises = await _context.Exercises.Include("Activity").Where(x => x.WorkoutID == model.ID).ToListAsync();

                Workouts.Add(new WorkoutViewModel() { Workout = model, Exercises = workoutExercises });
            }
            return Workouts;
        }

        // GET: api/Produc/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WorkoutViewModel>> GetWorkoutModel(int id)
        {
            var WorkoutModel = await _context.Workouts.FindAsync(id);

            if (WorkoutModel == null)
            {
                return NotFound();
            }

            var ExcerciseModels = await _context.Exercises.Include("Activity").Where(x => x.WorkoutID == WorkoutModel.ID).ToListAsync();
            return new WorkoutViewModel() { Workout = WorkoutModel, Exercises = ExcerciseModels };
        }

        // PUT: api/Produc/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorkoutModel(int id, WorkoutModel WorkoutModel)
        {
            if (id != WorkoutModel.ID)
            {
                return BadRequest();
            }

            _context.Entry(WorkoutModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkoutModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Produc
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<WorkoutModel>> PostWorkoutModel(WorkoutModel WorkoutModel)
        {
            _context.Workouts.Add(WorkoutModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWorkoutModel", new { id = WorkoutModel.ID }, WorkoutModel);
        }

        // DELETE: api/Produc/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkoutModel(int id)
        {
            var WorkoutModel = await _context.Workouts.FindAsync(id);
            if (WorkoutModel == null)
            {
                return NotFound();
            }

            var exercises = await _context.Exercises.Where(x => x.WorkoutID == WorkoutModel.ID).ToListAsync();

            _context.Exercises.RemoveRange(exercises);
            _context.Workouts.Remove(WorkoutModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WorkoutModelExists(int id)
        {
            return _context.Workouts.Any(e => e.ID == id);
        }
    }
}
