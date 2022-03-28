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
    [Route("api/activities")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ActivitiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActivityModel>>> GetAllActivities()
        {
            return await _context.Activities.ToListAsync();
        }

        // GET: api/Produc
        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<ActivityModel>>> GetActivities(string id)
        {
            return await _context.Activities.Where(u => u.UserID == id).ToListAsync();
        }

        [HttpGet("user/stats/{id}")]
        public async Task<ActionResult<ActivityStatisticModel>> GetActivityStatistics(string id)
        {
            var arrayList =  await _context.Activities.Where(u => u.UserID == id).ToListAsync();
            var typeList = new List<String>();

            if(arrayList != null)
            {
                foreach (var activity in arrayList)
                {
                    typeList.Add(activity.Type);
                }

                var typeGroup = typeList.GroupBy(u => u);

                string commonType = "";
                int commonCount = 0;

                foreach (var g in typeGroup)
                {
                    if (g.Count() > commonCount) { commonCount = g.Count(); commonType = g.Key; }
                }

                return new ActivityStatisticModel() { CommonType = commonType, TypeCount = commonCount, ActivityCount = arrayList.Count() };
            }
            else
            {
                return NotFound();
            }
        }

        // GET: api/Produc/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityModel>> GetActivityModel(int id)
        {
            var ActivityModel = await _context.Activities.FindAsync(id);

            if (ActivityModel == null)
            {
                return NotFound();
            }

            return ActivityModel;
        }

        // PUT: api/Produc/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutActivityModel(int id, ActivityModel ActivityModel)
        {
            if (id != ActivityModel.ID)
            {
                return BadRequest();
            }

            _context.Entry(ActivityModel).State = EntityState.Modified;

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
        public async Task<ActionResult<ActivityModel>> PostActivityModel(ActivityModel ActivityModel)
        {
            _context.Activities.Add(ActivityModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetActivityModel", new { id = ActivityModel.ID }, ActivityModel);
        }

        // DELETE: api/Produc/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivityModel(int id)
        {
            var ActivityModel = await _context.Activities.FindAsync(id);
            if (ActivityModel == null)
            {
                return NotFound();
            }

            _context.Activities.Remove(ActivityModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ActivityModelExists(int id)
        {
            return _context.Activities.Any(e => e.ID == id);
        }
    }
}
