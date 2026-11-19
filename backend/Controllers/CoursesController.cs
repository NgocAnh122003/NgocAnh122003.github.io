using Dvna.Api.Data;
using Dvna.Api.Dtos;
using Dvna.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dvna.Api.Controllers;

// GET /api/courses – danh sách khoá học đang hiển thị
[ApiController]
[Route("api/[controller]")]
public class CoursesController(AppDbContext db, PublicCache cache) : ControllerBase
{
    [HttpGet]
    public Task<List<CourseDto>> Get() =>
        cache.GetAsync(PublicCache.Courses, () => db.Courses
            .Where(c => c.IsPublished)
            .OrderBy(c => c.SortOrder)
            .Select(c => new CourseDto(c.Id, c.Title, c.Level, c.Icon, c.Color, c.Description,
                c.Topics, c.Price, c.Schedule, c.Format))
            .ToListAsync());
}
