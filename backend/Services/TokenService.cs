using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Dvna.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace Dvna.Api.Services;

public class JwtOptions
{
    public string Key { get; set; } = "";
    public string Issuer { get; set; } = "dvna-api";
    public int ExpireHours { get; set; } = 12;

    public SymmetricSecurityKey SigningKey() => new(Encoding.UTF8.GetBytes(Key));
}

// Tạo "vé đăng nhập" (JWT) cho giáo viên sau khi nhập đúng mật khẩu
public class TokenService(JwtOptions options)
{
    public (string Token, DateTime ExpiresAt) Create(AdminUser user)
    {
        var expires = DateTime.UtcNow.AddHours(options.ExpireHours);
        var token = new JwtSecurityToken(
            issuer: options.Issuer,
            audience: options.Issuer,
            claims:
            [
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
            ],
            expires: expires,
            signingCredentials: new SigningCredentials(options.SigningKey(), SecurityAlgorithms.HmacSha256));
        return (new JwtSecurityTokenHandler().WriteToken(token), expires);
    }
}
