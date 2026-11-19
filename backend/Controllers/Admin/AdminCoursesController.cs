using Dvna.Api.Data;
using Dvna.Api.Dtos;
using Dvna.Api.Models;
using Dvna.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dvna.Api.Controllers.Admin;

// Thêm / sửa / xoá khoá học (chỉ giáo viên đã đăng nhập)
[ApiController]
[Authorize]
[Route("api/admin/courses")]
public class AdminCoursesController(AppDbContext db, PublicCache cache) : ControllerBase
{
    [HttpGet]
    public async Task<List<Course>> List() =>
        await db.Courses.OrderBy(c => c.SortOrder).ThenBy(c => c.Id).ToListAsync();

    [HttpPost]
    public async Task<Course> Create(CourseInput input)
    {
        var course = new Course();
        input.ApplyTo(course);
        db.Courses.Add(course);
        await db.SaveChangesAsync();
        cache.Invalidate(PublicCache.Courses);
        return course;
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CourseInput input)
    {
        var course = await db.Courses.FindAsync(id);
        if (course is null) return NotFound();
        input.ApplyTo(course);
        await db.SaveChangesAsync();
        cache.Invalidate(PublicCache.Courses);
        return Ok(course);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await db.Courses.Where(c => c.Id == id).ExecuteDeleteAsync();
        cache.Invalidate(PublicCache.Courses);
        return deleted == 0 ? NotFound() : NoContent();
    }
}
