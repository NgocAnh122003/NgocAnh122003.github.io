namespace Dvna.Api.Models;

// Cảm nhận của học sinh / phụ huynh (chỉ hiện khi IsPublished = true)
public class Testimonial
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Role { get; set; } = "";         // VD: "HS lớp 9", "Phụ huynh em An"
    public string Content { get; set; } = "";
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;
}
