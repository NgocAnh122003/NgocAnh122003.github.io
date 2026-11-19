using Dvna.Api.Data;
using Dvna.Api.Dtos;
using Dvna.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dvna.Api.Controllers.Admin;

// Quản lý đơn đăng ký học thử (chỉ giáo viên đã đăng nhập)
[ApiController]
[Authorize]
[Route("api/admin/registrations")]
public class AdminRegistrationsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<List<Registration>> List([FromQuery] RegistrationStatus? status)
    {
        var query = db.Registrations.AsQueryable();
        if (status is not null) query = query.Where(r => r.Status == status);
        return await query.OrderByDescending(r => r.CreatedAt).ToListAsync();
    }

    [HttpGet("summary")]
    public async Task<RegistrationSummary> Summary()
    {
        var counts = await db.Registrations
            .GroupBy(r => r.Status)
            .Select(g => new { g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Key, x => x.Count);
        int Get(RegistrationStatus s) => counts.GetValueOrDefault(s);
        return new RegistrationSummary(
            Get(RegistrationStatus.New), Get(RegistrationStatus.Contacted),
            Get(RegistrationStatus.Enrolled), Get(RegistrationStatus.Closed), counts.Values.Sum());
    }

    [HttpPatch("{id:int}")]
    public async Task<IActionResult> Update(int id, RegistrationUpdate req)
    {
        var r = await db.Registrations.FindAsync(id);
        if (r is null) return NotFound();
        r.Status = req.Status;
        r.Note = string.IsNullOrWhiteSpace(req.Note) ? null : req.Note.Trim();
        await db.SaveChangesAsync();
        return Ok(r);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await db.Registrations.Where(r => r.Id == id).ExecuteDeleteAsync();
        return deleted == 0 ? NotFound() : NoContent();
    }
}
