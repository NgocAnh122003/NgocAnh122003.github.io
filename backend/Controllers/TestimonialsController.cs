using Dvna.Api.Data;
using Dvna.Api.Dtos;
using Dvna.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dvna.Api.Controllers;

// GET /api/testimonials – cảm nhận học sinh / phụ huynh
[ApiController]
[Route("api/[controller]")]
public class TestimonialsController(AppDbContext db, PublicCache cache) : ControllerBase
{
    [HttpGet]
    public Task<List<TestimonialDto>> Get() =>
        cache.GetAsync(PublicCache.Testimonials, () => db.Testimonials
            .Where(t => t.IsPublished)
            .OrderBy(t => t.SortOrder)
            .Select(t => new TestimonialDto(t.Id, t.Name, t.Role, t.Content))
            .ToListAsync());
}
