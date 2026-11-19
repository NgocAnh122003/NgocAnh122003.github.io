using Dvna.Api.Data;
using Dvna.Api.Dtos;
using Dvna.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dvna.Api.Controllers;

// GET /api/documents – các tab tài liệu và link bên trong
[ApiController]
[Route("api/[controller]")]
public class DocumentsController(AppDbContext db, PublicCache cache) : ControllerBase
{
    [HttpGet]
    public Task<List<DocumentGroupDto>> Get() =>
        cache.GetAsync(PublicCache.Documents, () => db.DocumentGroups
            .Where(g => g.IsPublished)
            .OrderBy(g => g.SortOrder)
            .Select(g => new DocumentGroupDto(g.Key, g.Label,
                g.Items.OrderBy(i => i.SortOrder)
                    .Select(i => new DocumentItemDto(i.Subject, i.Icon, i.Color, i.Link))
                    .ToList()))
            .ToListAsync());
}
