using Dvna.Api.Data;
using Dvna.Api.Dtos;
using Dvna.Api.Models;
using Dvna.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Dvna.Api.Controllers;

// POST /api/registrations – nhận đơn đăng ký học thử từ form "Liên hệ"
[ApiController]
[Route("api/[controller]")]
public class RegistrationsController(AppDbContext db, EmailNotifier notifier, ILogger<RegistrationsController> logger)
    : ControllerBase
{
    [HttpPost]
    [EnableRateLimiting("registration")]
    public async Task<IActionResult> Create(RegistrationRequest req)
    {
        // Bot điền vào ô bẫy → giả vờ thành công, không lưu
        if (!string.IsNullOrEmpty(req.Website))
            return Accepted();

        var registration = new Registration
        {
            StudentName = req.StudentName.Trim(),
            Phone = req.Phone.Trim(),
            Grade = req.Grade.Trim(),
            Message = string.IsNullOrWhiteSpace(req.Message) ? null : req.Message.Trim(),
        };

        try
        {
            db.Registrations.Add(registration);
            await db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Database tạm dừng (VD: hết hạn mức miễn phí trong tháng) → vẫn báo cho Thầy qua email
            logger.LogError(ex, "Không lưu được đơn đăng ký vào database");
            if (await notifier.NotifyRegistrationAsync(registration, savedToDatabase: false))
                return Accepted();
            return Problem(statusCode: 503, detail: "Hệ thống đang bận. Em nhắn Zalo cho thầy giúp nhé!");
        }

        // Gửi mail chạy ngầm, học sinh không phải chờ
        _ = notifier.NotifyRegistrationAsync(registration);
        return Accepted(new { registration.Id });
    }
}
