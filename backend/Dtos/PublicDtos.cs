using System.ComponentModel.DataAnnotations;

namespace Dvna.Api.Dtos;

// Dữ liệu trả về cho trang công khai (không lộ các trường nội bộ)
public record CourseDto(
    int Id, string Title, string Level, string Icon, string Color, string Description,
    List<string> Topics, string? Price, string? Schedule, string? Format);

public record DocumentItemDto(string Subject, string Icon, string Color, string? Link);

public record DocumentGroupDto(string Key, string Label, List<DocumentItemDto> Items);

public record TestimonialDto(int Id, string Name, string Role, string Content);

// Dữ liệu form đăng ký gửi lên
public class RegistrationRequest
{
    [Required(ErrorMessage = "Vui lòng nhập họ tên")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Họ tên từ 2 đến 100 ký tự")]
    public string StudentName { get; set; } = "";

    [Required(ErrorMessage = "Vui lòng nhập số điện thoại")]
    [RegularExpression(@"^(\+?84|0)[0-9 .]{8,13}$", ErrorMessage = "Số điện thoại không hợp lệ")]
    public string Phone { get; set; } = "";

    [Required(ErrorMessage = "Vui lòng chọn lớp")]
    [StringLength(20)]
    public string Grade { get; set; } = "";

    [StringLength(1000, ErrorMessage = "Lời nhắn tối đa 1000 ký tự")]
    public string? Message { get; set; }

    [Range(typeof(bool), "true", "true", ErrorMessage = "Vui lòng đồng ý với chính sách bảo mật")]
    public bool Consent { get; set; }

    // Bẫy chống spam: ô ẩn, người thật không điền. Bot điền vào thì bỏ qua.
    public string? Website { get; set; }
}
