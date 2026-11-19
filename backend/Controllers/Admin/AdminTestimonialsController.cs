using Dvna.Api.Data;
using Dvna.Api.Dtos;
using Dvna.Api.Models;
using Dvna.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dvna.Api.Controllers.Admin;

// Thêm / sửa / xoá cảm nhận học sinh (chỉ giáo viên đã đăng nhập)
[ApiController]
[Authorize]
[Route("api/admin/testimonials")]
public class AdminTestimonialsController(AppDbContext db, PublicCache cache) : ControllerBase
{
    [HttpGet]
    public async Task<List<Testimonial>> List() =>
        await db.Testimonials.OrderBy(t => t.SortOrder).ThenBy(t => t.Id).ToListAsync();

    [HttpPost]
    public async Task<Testimonial> Create(TestimonialInput input)
    {
        var t = new Testimonial();
        input.ApplyTo(t);
        db.Testimonials.Add(t);
        await db.SaveChangesAsync();
        cache.Invalidate(PublicCache.Testimonials);
        return t;
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, TestimonialInput input)
    {
        var t = await db.Testimonials.FindAsync(id);
        if (t is null) return NotFound();
        input.ApplyTo(t);
        await db.SaveChangesAsync();
        cache.Invalidate(PublicCache.Testimonials);
        return Ok(t);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await db.Testimonials.Where(t => t.Id == id).ExecuteDeleteAsync();
        cache.Invalidate(PublicCache.Testimonials);
        return deleted == 0 ? NotFound() : NoContent();
    }
}
