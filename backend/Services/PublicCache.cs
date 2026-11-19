using Microsoft.Extensions.Caching.Memory;

namespace Dvna.Api.Services;

// Giữ dữ liệu trang chủ (khoá học, tài liệu, cảm nhận) trong bộ nhớ 30 phút
// để đỡ phải gọi database — giúp không vượt hạn mức database miễn phí.
// Khi Thầy sửa trong trang quản trị, bộ nhớ đệm được xoá để cập nhật ngay.
public class PublicCache(IMemoryCache cache)
{
    public const string Courses = "public:courses";
    public const string Documents = "public:documents";
    public const string Testimonials = "public:testimonials";

    static readonly TimeSpan Lifetime = TimeSpan.FromMinutes(30);

    public async Task<T> GetAsync<T>(string key, Func<Task<T>> load) =>
        (await cache.GetOrCreateAsync(key, entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = Lifetime;
            return load();
        }))!;

    public void Invalidate(string key) => cache.Remove(key);
}
