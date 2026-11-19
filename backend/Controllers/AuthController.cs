using System.Security.Claims;
using Dvna.Api.Data;
using Dvna.Api.Dtos;
using Dvna.Api.Models;
using Dvna.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace Dvna.Api.Controllers;

// Đăng nhập / đổi mật khẩu cho trang quản trị
[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db, TokenService tokens, IPasswordHasher<AdminUser> hasher) : ControllerBase
{
    const int MaxFailedLogins = 5;
    static readonly TimeSpan LockDuration = TimeSpan.FromMinutes(15);

    [HttpPost("login")]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var user = await db.AdminUsers.FirstOrDefaultAsync(u => u.Username == req.Username.Trim());
        if (user is null)
            return Unauthorized(Error("Sai tên đăng nhập hoặc mật khẩu"));

        if (user.LockedUntil > DateTime.UtcNow)
            return StatusCode(423, Error("Tài khoản tạm khoá do nhập sai nhiều lần. Thử lại sau 15 phút."));

        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            user.FailedLogins++;
            if (user.FailedLogins >= MaxFailedLogins)
            {
                user.LockedUntil = DateTime.UtcNow.Add(LockDuration);
                user.FailedLogins = 0;
            }
            await db.SaveChangesAsync();
            return Unauthorized(Error("Sai tên đăng nhập hoặc mật khẩu"));
        }

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
            user.PasswordHash = hasher.HashPassword(user, req.Password);
        user.FailedLogins = 0;
        user.LockedUntil = null;
        await db.SaveChangesAsync();

        var (token, expiresAt) = tokens.Create(user);
        return Ok(new LoginResponse(token, expiresAt, user.Username));
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest req)
    {
        var id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await db.AdminUsers.FindAsync(id);
        if (user is null) return Unauthorized();

        if (hasher.VerifyHashedPassword(user, user.PasswordHash, req.CurrentPassword) == PasswordVerificationResult.Failed)
            return BadRequest(Error("Mật khẩu hiện tại không đúng"));

        user.PasswordHash = hasher.HashPassword(user, req.NewPassword);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // Trả lỗi cùng dạng với lỗi kiểm tra dữ liệu để frontend hiển thị thống nhất
    static object Error(string message) => new { errors = new { _ = new[] { message } } };
}
