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
        public async Task<ActionResult<IEnumerable<WorkoutModel>>> GetActivities()
        {
            return await _context.Workouts.Include("Activity").ToListAsync();
        }

        // GET: api/Produc/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WorkoutModel>> GetActivityModel(int id)
        {
            var WorkoutModel = await _context.Workouts.Include("Activity").Where(x => x.ID == id).ToListAsync();

            if (WorkoutModel == null)
            {
                return NotFound();
            }

            return WorkoutModel.FirstOrDefault();
        }

        // PUT: api/Produc/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutActivityModel(int id, WorkoutModel WorkoutModel)
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
                if (!ActivityModelExists(id))
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
        public async Task<ActionResult<WorkoutModel>> PostActivityModel(WorkoutModel WorkoutModel)
        {
            _context.Workouts.Add(WorkoutModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetActivityModel", new { id = WorkoutModel.ID }, WorkoutModel);
        }

        // DELETE: api/Produc/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivityModel(int id)
        {
            var WorkoutModel = await _context.Workouts.FindAsync(id);
            if (WorkoutModel == null)
            {
                return NotFound();
            }

            _context.Workouts.Remove(WorkoutModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ActivityModelExists(int id)
        {
            return _context.Workouts.Any(e => e.ID == id);
        }
    }
}
