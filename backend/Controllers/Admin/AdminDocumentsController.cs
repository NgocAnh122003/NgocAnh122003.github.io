using Dvna.Api.Data;
using Dvna.Api.Dtos;
using Dvna.Api.Models;
using Dvna.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dvna.Api.Controllers.Admin;

// Quản lý các tab tài liệu và link bên trong (chỉ giáo viên đã đăng nhập)
[ApiController]
[Authorize]
[Route("api/admin/documents")]
public class AdminDocumentsController(AppDbContext db, PublicCache cache) : ControllerBase
{
    [HttpGet]
    public async Task<List<DocumentGroup>> List()
    {
        var groups = await db.DocumentGroups.Include(g => g.Items)
            .OrderBy(g => g.SortOrder).ThenBy(g => g.Id).ToListAsync();
        groups.ForEach(g => g.Items = g.Items.OrderBy(i => i.SortOrder).ToList());
        return groups;
    }

    [HttpPost]
    public async Task<IActionResult> Create(DocumentGroupInput input)
    {
        if (await db.DocumentGroups.AnyAsync(g => g.Key == input.Key.Trim()))
            return Conflict(KeyTaken());
        var group = new DocumentGroup();
        input.ApplyTo(group);
        db.DocumentGroups.Add(group);
        await db.SaveChangesAsync();
        cache.Invalidate(PublicCache.Documents);
        return Ok(group);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, DocumentGroupInput input)
    {
        var group = await db.DocumentGroups.Include(g => g.Items).FirstOrDefaultAsync(g => g.Id == id);
        if (group is null) return NotFound();
        if (await db.DocumentGroups.AnyAsync(g => g.Key == input.Key.Trim() && g.Id != id))
            return Conflict(KeyTaken());

        db.DocumentItems.RemoveRange(group.Items);
        input.ApplyTo(group);
        await db.SaveChangesAsync();
        cache.Invalidate(PublicCache.Documents);
        return Ok(group);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var group = await db.DocumentGroups.FindAsync(id);
        if (group is null) return NotFound();
        db.DocumentGroups.Remove(group);   // xoá luôn các tài liệu bên trong
        await db.SaveChangesAsync();
        cache.Invalidate(PublicCache.Documents);
        return NoContent();
    }

    static object KeyTaken() => new { errors = new { Key = new[] { "Mã nhóm này đã tồn tại" } } };
}
