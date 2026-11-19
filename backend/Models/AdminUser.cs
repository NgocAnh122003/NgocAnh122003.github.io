namespace Dvna.Api.Models;

// Tài khoản đăng nhập trang quản trị (giáo viên)
public class AdminUser
{
    public int Id { get; set; }
    public string Username { get; set; } = "";
    public string PasswordHash { get; set; } = "";   // mật khẩu đã mã hoá, không lưu bản gốc
    public int FailedLogins { get; set; }
    public DateTime? LockedUntil { get; set; }        // khoá tạm sau nhiều lần sai mật khẩu
}
