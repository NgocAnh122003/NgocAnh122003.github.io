using Dvna.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace Dvna.Api.Data;

// Dữ liệu ban đầu — chỉ chạy khi bảng còn trống, không ghi đè dữ liệu Thầy đã sửa.
// Link tài liệu KHÔNG ghi trong code (repo công khai) — Thầy nhập qua trang /admin.
public static class DbSeeder
{
    // Tạo tài khoản quản trị đầu tiên từ cấu hình Admin:Username / Admin:InitialPassword
    public static void SeedAdmin(AppDbContext db, IConfiguration config, IPasswordHasher<AdminUser> hasher, ILogger logger)
    {
        if (db.AdminUsers.Any()) return;

        var username = config["Admin:Username"];
        var password = config["Admin:InitialPassword"];
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            logger.LogWarning("Chưa có tài khoản quản trị. Hãy đặt Admin:Username và Admin:InitialPassword rồi khởi động lại.");
            return;
        }

        var admin = new AdminUser { Username = username.Trim() };
        admin.PasswordHash = hasher.HashPassword(admin, password);
        db.AdminUsers.Add(admin);
        db.SaveChanges();
        logger.LogInformation("Đã tạo tài khoản quản trị '{Username}'", admin.Username);
    }

    public static void Seed(AppDbContext db)
    {
        if (!db.Courses.Any())
        {
            db.Courses.AddRange(
                new Course
                {
                    Title = "Khoa học tự nhiên 7 – 9", Level = "THCS", Icon = "🌱", Color = "mint", SortOrder = 1,
                    Description = "Xây nền vững cả Lý – Hoá – Sinh qua thí nghiệm, hình ảnh trực quan và ví dụ đời sống.",
                    Topics = ["Chất và sự biến đổi của chất", "Vật sống", "Năng lượng và sự biến đổi", "Trái Đất và bầu trời"],
                },
                new Course
                {
                    Title = "Vật lý 10 – 11 – 12", Level = "THPT", Icon = "⚛️", Color = "brand", SortOrder = 2,
                    Description = "Nắm chắc kiến thức SGK mới, hiểu bản chất và giải nhanh các dạng bài trọng tâm.",
                    Topics =
                    [
                        "Lớp 10: Động học, động lực học, năng lượng, động lượng",
                        "Lớp 11: Dao động, sóng, điện trường, dòng điện",
                        "Lớp 12: Vật lí nhiệt, khí lí tưởng, từ trường, hạt nhân",
                    ],
                },
                new Course
                {
                    Title = "Luyện đề tốt nghiệp THPT", Level = "Luyện thi", Icon = "🎯", Color = "coral", SortOrder = 3,
                    Description = "Luyện đủ 3 dạng câu hỏi theo cấu trúc đề thi mới, rèn tốc độ và sự chính xác.",
                    Topics = ["Trắc nghiệm nhiều lựa chọn", "Trắc nghiệm Đúng / Sai", "Câu trả lời ngắn", "Đề thi thử có chữa chi tiết"],
                });
        }

        if (!db.DocumentGroups.Any())
        {
            db.DocumentGroups.AddRange(
                Khtn("khtn7", "KHTN 7", 1),
                Khtn("khtn8", "KHTN 8", 2),
                Khtn("khtn9", "KHTN 9", 3),
                Physics("vl10", "Vật lý 10", 4, "Đề kiểm tra"),
                Physics("vl11", "Vật lý 11", 5, "Đề kiểm tra"),
                Physics("vl12", "Vật lý 12", 6, "Đề thi thử"));
        }

        db.SaveChanges();
    }

    static DocumentGroup Khtn(string key, string label, int order) => new()
    {
        Key = key, Label = label, SortOrder = order,
        Items =
        [
            new() { Subject = "Vật lý", Icon = "🚀", Color = "sky", SortOrder = 1 },
            new() { Subject = "Hoá học", Icon = "🧪", Color = "coral", SortOrder = 2 },
            new() { Subject = "Sinh học", Icon = "🧬", Color = "mint", SortOrder = 3 },
        ],
    };

    static DocumentGroup Physics(string key, string label, int order, string examLabel) => new()
    {
        Key = key, Label = label, SortOrder = order,
        Items =
        [
            new() { Subject = "Lý thuyết", Icon = "📘", Color = "brand", SortOrder = 1 },
            new() { Subject = "Bài tập", Icon = "✏️", Color = "sky", SortOrder = 2 },
            new() { Subject = examLabel, Icon = "📝", Color = "coral", SortOrder = 3 },
        ],
    };
}
