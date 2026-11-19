namespace Dvna.Api.Models;

public enum RegistrationStatus
{
    New,        // Mới
    Contacted,  // Đã liên hệ
    Enrolled,   // Đã nhập học
    Closed,     // Không theo học
}

// Đơn đăng ký học thử gửi từ form "Liên hệ"
public class Registration
{
    public int Id { get; set; }
    public string StudentName { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Grade { get; set; } = "";
    public string? Message { get; set; }
    public RegistrationStatus Status { get; set; } = RegistrationStatus.New;
    public string? Note { get; set; }              // ghi chú riêng của thầy
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
