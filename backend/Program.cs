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

var builder = WebApplication.CreateBuilder(args);

// Database SQL Server (chuỗi kết nối trong appsettings / biến môi trường).
// Tự thử lại khi Azure SQL miễn phí đang "thức dậy" sau khi tạm dừng.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default"),
        sql => sql.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(10), errorNumbersToAdd: null)));

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

static RateLimitPartition<string> PerIp(HttpContext http, int limit, TimeSpan window) =>
    RateLimitPartition.GetFixedWindowLimiter(
        http.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = limit, Window = window });
