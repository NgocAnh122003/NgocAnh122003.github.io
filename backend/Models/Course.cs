namespace Dvna.Api.Models;

// Một khoá học hiển thị ở mục "Khoá học"
public class Course
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Level { get; set; } = "";        // THCS, THPT, Luyện thi...
    public string Icon { get; set; } = "";         // emoji
    public string Color { get; set; } = "brand";   // sky | coral | mint | brand | sun
    public string Description { get; set; } = "";
    public List<string> Topics { get; set; } = [];
    public string? Price { get; set; }             // VD: "800.000đ / tháng" (để trống = "Liên hệ")
    public string? Schedule { get; set; }          // VD: "2 buổi/tuần · 90 phút"
    public string? Format { get; set; }            // VD: "Nhóm ≤ 8 HS · Online/Offline"
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;
}
