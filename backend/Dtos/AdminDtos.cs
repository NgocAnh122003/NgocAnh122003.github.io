using System.ComponentModel.DataAnnotations;
using Dvna.Api.Models;

namespace Dvna.Api.Dtos;

public class LoginRequest
{
    [Required(ErrorMessage = "Vui lòng nhập tên đăng nhập")]
    public string Username { get; set; } = "";

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
    public string Password { get; set; } = "";
}

public record LoginResponse(string Token, DateTime ExpiresAt, string Username);

public class ChangePasswordRequest
{
    [Required(ErrorMessage = "Vui lòng nhập mật khẩu hiện tại")]
    public string CurrentPassword { get; set; } = "";

    [Required, StringLength(100, MinimumLength = 8, ErrorMessage = "Mật khẩu mới phải có ít nhất 8 ký tự")]
    public string NewPassword { get; set; } = "";
}

// Màu hợp lệ — khớp với bảng màu trong frontend/src/app/globals.css
public static class Palette
{
    public const string Pattern = "^(sky|coral|mint|brand|sun)$";
    public const string Error = "Màu phải là một trong: sky, coral, mint, brand, sun";
}

public class CourseInput
{
    [Required(ErrorMessage = "Vui lòng nhập tên khoá học"), StringLength(150)]
    public string Title { get; set; } = "";
    [StringLength(50)] public string Level { get; set; } = "";
    [StringLength(20)] public string Icon { get; set; } = "";
    [RegularExpression(Palette.Pattern, ErrorMessage = Palette.Error)] public string Color { get; set; } = "brand";
    [StringLength(1000)] public string Description { get; set; } = "";
    public List<string> Topics { get; set; } = [];
    [StringLength(100)] public string? Price { get; set; }
    [StringLength(150)] public string? Schedule { get; set; }
    [StringLength(150)] public string? Format { get; set; }
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;

    public void ApplyTo(Course c)
    {
        c.Title = Title.Trim();
        c.Level = Level.Trim();
        c.Icon = Icon.Trim();
        c.Color = Color;
        c.Description = Description.Trim();
        c.Topics = Topics.Select(t => t.Trim()).Where(t => t.Length > 0).ToList();
        c.Price = Blank(Price);
        c.Schedule = Blank(Schedule);
        c.Format = Blank(Format);
        c.SortOrder = SortOrder;
        c.IsPublished = IsPublished;
    }

    internal static string? Blank(string? s) => string.IsNullOrWhiteSpace(s) ? null : s.Trim();
}

public class DocumentItemInput
{
    [Required(ErrorMessage = "Vui lòng nhập tên tài liệu"), StringLength(100)]
    public string Subject { get; set; } = "";
    [StringLength(20)] public string Icon { get; set; } = "";
    [RegularExpression(Palette.Pattern, ErrorMessage = Palette.Error)] public string Color { get; set; } = "brand";
    [StringLength(500), Url(ErrorMessage = "Link phải bắt đầu bằng http:// hoặc https://")]
    public string? Link { get; set; }
}

public class DocumentGroupInput
{
    [Required(ErrorMessage = "Vui lòng nhập mã nhóm"), StringLength(50)]
    [RegularExpression("^[a-z0-9-]+$", ErrorMessage = "Mã nhóm chỉ gồm chữ thường không dấu, số và dấu gạch ngang")]
    public string Key { get; set; } = "";
    [Required(ErrorMessage = "Vui lòng nhập tên tab"), StringLength(100)]
    public string Label { get; set; } = "";
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;
    public List<DocumentItemInput> Items { get; set; } = [];

    public void ApplyTo(DocumentGroup g)
    {
        g.Key = Key.Trim();
        g.Label = Label.Trim();
        g.SortOrder = SortOrder;
        g.IsPublished = IsPublished;
        g.Items.Clear();
        g.Items.AddRange(Items.Select((i, idx) => new DocumentItem
        {
            Subject = i.Subject.Trim(),
            Icon = i.Icon.Trim(),
            Color = i.Color,
            Link = CourseInput.Blank(i.Link),
            SortOrder = idx + 1,
        }));
    }
}

public class TestimonialInput
{
    [Required(ErrorMessage = "Vui lòng nhập tên"), StringLength(100)]
    public string Name { get; set; } = "";
    [StringLength(100)] public string Role { get; set; } = "";
    [Required(ErrorMessage = "Vui lòng nhập nội dung"), StringLength(1000)]
    public string Content { get; set; } = "";
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;

    public void ApplyTo(Testimonial t)
    {
        t.Name = Name.Trim();
        t.Role = Role.Trim();
        t.Content = Content.Trim();
        t.SortOrder = SortOrder;
        t.IsPublished = IsPublished;
    }
}

public class RegistrationUpdate
{
    public RegistrationStatus Status { get; set; }
    [StringLength(1000)] public string? Note { get; set; }
}

public record RegistrationSummary(int New, int Contacted, int Enrolled, int Closed, int Total);
