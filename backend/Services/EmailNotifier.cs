using System.Net;
using System.Net.Http.Headers;
using Dvna.Api.Models;

namespace Dvna.Api.Services;

public class EmailOptions
{
    public string? ResendApiKey { get; set; }   // khoá API của resend.com
    public string From { get; set; } = "DVNA Website <onboarding@resend.dev>";
    public string? To { get; set; }             // địa chỉ nhận thông báo (email đăng ký Resend)
}

// Gửi email cho Thầy khi có đơn đăng ký mới, qua dịch vụ Resend (HTTPS, không cần SMTP).
// Chưa cấu hình thì chỉ ghi log — đơn vẫn được lưu.
public class EmailNotifier(HttpClient http, IConfiguration config, ILogger<EmailNotifier> logger)
{
    readonly EmailOptions _options = config.GetSection("Email").Get<EmailOptions>() ?? new();

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(_options.ResendApiKey) && !string.IsNullOrWhiteSpace(_options.To);

    // Trả về true nếu gửi thành công
    public async Task<bool> NotifyRegistrationAsync(Registration r, bool savedToDatabase = true)
    {
        if (!IsConfigured)
        {
            logger.LogInformation("Chưa cấu hình Email – bỏ qua thông báo đơn #{Id}", r.Id);
            return false;
        }

        var vnTime = r.CreatedAt.AddHours(7).ToString("HH:mm dd/MM/yyyy");
        string E(string? s) => WebUtility.HtmlEncode(s ?? "");
        var warning = savedToDatabase
            ? ""
            : "<p style=\"background:#fee2e2;color:#b91c1c;padding:10px;border-radius:8px\">⚠️ Database đang tạm dừng nên đơn này <b>chưa được lưu</b> vào trang quản trị. Thầy lưu lại thông tin trong email này nhé.</p>";
        var title = savedToDatabase ? $"Đăng ký học mới #{r.Id}" : "Đăng ký học mới (chưa lưu vào database)";

        var payload = new
        {
            from = _options.From,
            to = new[] { _options.To },
            subject = $"🎉 {r.StudentName} – {r.Grade} đăng ký học",
            text = $"{title}\nHọc sinh: {r.StudentName}\nLớp: {r.Grade}\nSĐT: {r.Phone}\n" +
                   $"Lời nhắn: {r.Message ?? "(không có)"}\nThời gian: {vnTime}",
            html = $"""
                <div style="font-family:Arial,sans-serif;font-size:15px;color:#1e1b4b">
                  <h2 style="color:#7c3aed;margin:0 0 12px">🎉 {E(title)}</h2>
                  {warning}
                  <table cellpadding="6" style="border-collapse:collapse">
                    <tr><td><b>Học sinh</b></td><td>{E(r.StudentName)}</td></tr>
                    <tr><td><b>Lớp</b></td><td>{E(r.Grade)}</td></tr>
                    <tr><td><b>Số điện thoại</b></td><td>{E(r.Phone)}</td></tr>
                    <tr><td><b>Lời nhắn</b></td><td>{E(r.Message ?? "(không có)")}</td></tr>
                    <tr><td><b>Thời gian</b></td><td>{vnTime}</td></tr>
                  </table>
                </div>
                """,
        };

        try
        {
            using var req = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails")
            {
                Content = JsonContent.Create(payload),
            };
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ResendApiKey);
            var res = await http.SendAsync(req);
            if (res.IsSuccessStatusCode) return true;
            logger.LogWarning("Resend trả về {Status}: {Body}", res.StatusCode, await res.Content.ReadAsStringAsync());
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Không gửi được email cho đơn #{Id}", r.Id);
        }
        return false;
    }
}
