using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Dvna.Api.Data;
using Dvna.Api.Models;
using Dvna.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Database PostgreSQL (chuỗi kết nối trong user-secrets / biến môi trường).
// Tự thử lại khi database miễn phí của Neon đang "thức dậy" sau khi tạm nghỉ.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(PgConnectionString(builder.Configuration.GetConnectionString("Default")),
        pg => pg.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(10), errorCodesToAdd: null)));

// Render đứng trước ứng dụng như một proxy → lấy IP thật của người dùng từ X-Forwarded-For
builder.Services.Configure<ForwardedHeadersOptions>(o =>
{
    o.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    o.ForwardLimit = 1;          // chỉ tin địa chỉ do proxy của Render thêm vào
    o.KnownNetworks.Clear();
    o.KnownProxies.Clear();
});

builder.Services.AddMemoryCache();
builder.Services.AddSingleton<PublicCache>();

// Trả enum dạng chữ ("New", "Contacted"...) thay vì số
builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddOpenApi();

// Thông báo email khi có đơn đăng ký (qua Resend)
builder.Services.AddHttpClient<EmailNotifier>(c => c.Timeout = TimeSpan.FromSeconds(10));

// Đăng nhập quản trị bằng JWT
var jwt = builder.Configuration.GetSection("Jwt").Get<JwtOptions>() ?? new();
if (jwt.Key.Length < 32)
    throw new InvalidOperationException("Thiếu Jwt:Key (cần ít nhất 32 ký tự ngẫu nhiên). Xem README.");
builder.Services.AddSingleton(jwt);
builder.Services.AddSingleton<TokenService>();
builder.Services.AddSingleton<IPasswordHasher<AdminUser>, PasswordHasher<AdminUser>>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o => o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = jwt.Issuer,
        ValidAudience = jwt.Issuer,
        IssuerSigningKey = jwt.SigningKey(),
        ClockSkew = TimeSpan.FromMinutes(1),
    });
builder.Services.AddAuthorization();

// Chỉ cho phép frontend của Thầy gọi API
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

// Chống spam form và dò mật khẩu: giới hạn số lần gọi theo địa chỉ IP
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    o.AddPolicy("registration", http => PerIp(http, 5, TimeSpan.FromMinutes(10)));
    o.AddPolicy("login", http => PerIp(http, 10, TimeSpan.FromMinutes(5)));
});

var app = builder.Build();

// Tự tạo/cập nhật bảng và nạp dữ liệu ban đầu khi khởi động.
// Database chưa sẵn sàng thì vẫn chạy tiếp (trang chủ dùng dữ liệu dự phòng), lần khởi động sau sẽ thử lại.
app.Logger.LogInformation("Database: {Info}", DescribeConnection(builder.Configuration.GetConnectionString("Default")));
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
        DbSeeder.Seed(db);
        DbSeeder.SeedAdmin(db, app.Configuration,
            scope.ServiceProvider.GetRequiredService<IPasswordHasher<AdminUser>>(), app.Logger);
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Không khởi tạo được database lúc khởi động");
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseForwardedHeaders();
app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// Neon cho chuỗi dạng "postgresql://user:pass@host/db?sslmode=require" → đổi sang dạng Npgsql hiểu được.
// Chuỗi dạng "Host=...;Database=..." thì giữ nguyên.
// Tự bỏ phần thừa hay dính khi copy từ Neon: "psql '...'", "DATABASE_URL=...", dấu nháy, dấu cách.
static string? PgConnectionString(string? raw)
{
    var start = raw?.IndexOf("postgres", StringComparison.Ordinal) ?? -1;
    if (start < 0 || !raw![start..].Contains("://")) return raw?.Trim();
    var rest = raw[(raw.IndexOf("://", start, StringComparison.Ordinal) + 3)..].Trim().TrimEnd('\'', '"', ';');

    // Tự tách thay vì dùng Uri: mật khẩu có ký tự đặc biệt (/ # ? @) vẫn đọc đúng.
    // Dạng: user:pass@host[:port]/db?tham-so — tách theo dấu @ cuối cùng.
    var at = rest.LastIndexOf('@');
    var query = rest.IndexOf('?', at + 1);
    if (query >= 0) rest = rest[..query];
    var userInfo = at >= 0 ? rest[..at] : "";
    var hostPart = at >= 0 ? rest[(at + 1)..] : rest;

    var slash = hostPart.IndexOf('/');
    var hostPort = slash >= 0 ? hostPart[..slash] : hostPart;
    var colon = hostPort.LastIndexOf(':');
    var hasPort = colon >= 0 && int.TryParse(hostPort[(colon + 1)..], out _);
    var sep = userInfo.IndexOf(':');

    return new NpgsqlConnectionStringBuilder
    {
        Host = hasPort ? hostPort[..colon] : hostPort,
        Port = hasPort ? int.Parse(hostPort[(colon + 1)..]) : 5432,
        Database = Uri.UnescapeDataString(slash >= 0 ? hostPart[(slash + 1)..] : ""),
        Username = Uri.UnescapeDataString(sep >= 0 ? userInfo[..sep] : userInfo),
        Password = sep >= 0 ? Uri.UnescapeDataString(userInfo[(sep + 1)..]) : null,
        SslMode = SslMode.Require,
    }.ConnectionString;
}

// Mô tả chuỗi kết nối để ghi vào log — KHÔNG bao giờ in mật khẩu.
static string DescribeConnection(string? raw)
{
    if (string.IsNullOrWhiteSpace(raw)) return "chưa cấu hình ConnectionStrings:Default";
    try
    {
        var b = new NpgsqlConnectionStringBuilder(PgConnectionString(raw));
        return $"host={b.Host}, port={b.Port}, db={b.Database}, user={b.Username}, " +
               $"mật khẩu: {(string.IsNullOrEmpty(b.Password) ? "KHÔNG CÓ" : $"có ({b.Password.Length} ký tự)")}";
    }
    catch (Exception ex)
    {
        // Chỉ in "hình dạng" chuỗi: chữ và số thay bằng x, giữ dấu câu để thấy chỗ sai
        var shape = new string(raw.Take(80).Select(c => char.IsLetterOrDigit(c) ? 'x' : c).ToArray());
        return $"chuỗi không hợp lệ ({ex.Message}) — dạng: {shape} (dài {raw.Length} ký tự)";
    }
}

static RateLimitPartition<string> PerIp(HttpContext http, int limit, TimeSpan window) =>
    RateLimitPartition.GetFixedWindowLimiter(
        http.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = limit, Window = window });
