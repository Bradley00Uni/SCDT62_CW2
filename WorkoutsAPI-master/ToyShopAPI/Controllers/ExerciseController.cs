using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WorkoutAPI.Data;
using WorkoutAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace WorkoutAPI.Controllers
{
    [Route("api/exercises")]
    [ApiController]
    public class ExerciseController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ExerciseController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExerciseModel>>> GetExercises()
        {
            return await _context.Exercises.Include("Activity").ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExerciseModel>> GetExerciseModel(int id)
        {
            var ExerciseModel = await _context.Exercises.Include("Activity").Where(x => x.ActivityID == id).ToListAsync();

            if(ExerciseModel == null) { return NotFound(); }

            return ExerciseModel.FirstOrDefault();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutExerciseModel(int id, ExerciseModel ProductModel)
        {
            if (id != ProductModel.ID)
            {
                return BadRequest();
            }

            _context.Entry(ProductModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExerciseModelExists(id))
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

        [HttpPost]
        public async Task<IActionResult> PostExerciseModel(int id, ExerciseModel ExerciseModel)
        {
            ExerciseModel.Activity = await _context.Activities.FindAsync(ExerciseModel.ActivityID);
            _context.Exercises.Add(ExerciseModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExerciseModel", new { id = ExerciseModel.ID }, ExerciseModel);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteExerciseModel(int id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise != null) { return NotFound(); }

            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExerciseModelExists(int id)
        {
            return _context.Exercises.Any(e => e.ID == id);
        }
    }
}
