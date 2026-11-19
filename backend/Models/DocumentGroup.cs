namespace Dvna.Api.Models;

// Một nhóm tài liệu = một tab (VD: "KHTN 7", "Vật lý 10")
public class DocumentGroup
{
    public int Id { get; set; }
    public string Key { get; set; } = "";          // mã ngắn, VD: "khtn7"
    public string Label { get; set; } = "";
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;
    public List<DocumentItem> Items { get; set; } = [];
}

// Một ô tài liệu trong tab (VD: "Vật lý" → link Google Drive)
public class DocumentItem
{
    public int Id { get; set; }
    public int DocumentGroupId { get; set; }
    public string Subject { get; set; } = "";
    public string Icon { get; set; } = "";
    public string Color { get; set; } = "brand";
    public string? Link { get; set; }              // để trống = "Đang cập nhật"
    public int SortOrder { get; set; }
}
