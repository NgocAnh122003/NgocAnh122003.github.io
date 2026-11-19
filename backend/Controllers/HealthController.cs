using Microsoft.AspNetCore.Mvc;

namespace Dvna.Api.Controllers;

// Kiểm tra backend còn sống: GET /api/health
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "ok", time = DateTime.UtcNow });
}
