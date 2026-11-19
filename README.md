# DVNA – Website học tập của Thầy Đoàn Vũ Ngọc Ánh

Website giới thiệu, khoá học và tài liệu KHTN 7–9 & Vật lý 10–11–12.

```
DVNAWEB/
├── frontend/   ← Next.js (giao diện + trang quản trị /admin) → đăng lên GitHub Pages
└── backend/    ← ASP.NET Core 9 Web API + PostgreSQL → đăng lên Render, database ở Neon
```

## Chạy trên máy

**Backend** (cần .NET 9 SDK và PostgreSQL):
```bash
cd backend
# lần đầu: lưu chuỗi kết nối PostgreSQL trên máy (tự gõ, thay MẬT_KHẨU)
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;Database=dvna_edu;Username=postgres;Password=MẬT_KHẨU"
dotnet run --launch-profile http   # kiểm tra: http://localhost:5170/api/health
```
Lần chạy đầu, backend tự tạo database `dvna_edu`, nạp dữ liệu ban đầu và tạo tài khoản quản trị.

**Frontend** (cần Node.js):
```bash
cd frontend
npm install      # chỉ cần lần đầu
npm run dev      # trang chủ: http://localhost:3000 · quản trị: http://localhost:3000/admin
```

## Cấu hình bí mật (không nằm trong code, không lên GitHub)

Lưu bằng `dotnet user-secrets` trong thư mục `backend`:

| Khoá | Ý nghĩa |
|---|---|
| `Jwt:Key` | Chuỗi ngẫu nhiên ≥ 32 ký tự để ký phiên đăng nhập (đã tạo sẵn) |
| `Admin:InitialPassword` | Mật khẩu ban đầu của tài khoản `admin` (chỉ dùng khi chưa có tài khoản) |
| `ConnectionStrings:Default` | Chuỗi kết nối PostgreSQL |
| `Email:ResendApiKey` | Khoá API của Resend (`re_...`) để gửi email thông báo |

Email **nhận** thông báo: `Email:To` trong `backend/appsettings.json` (mặc định `dvna010203@gmail.com`).

## Bật thông báo email khi có đơn đăng ký

1. Đăng ký <https://resend.com> bằng đúng email nhận thông báo (gói miễn phí chỉ gửi tới email đã đăng ký).
2. **API Keys → Create API Key** (quyền *Sending access*) → được mã `re_...` (đừng gửi mã này cho ai).
3. Trên máy: `dotnet user-secrets set "Email:ResendApiKey" "re_..."`; trên Render: biến `Email__ResendApiKey`.
4. Chưa cấu hình thì đơn vẫn được lưu, chỉ không gửi mail.

## Đưa lên mạng (0đ)

| Phần | Dịch vụ | Cấu hình |
|---|---|---|
| Frontend | GitHub Pages | Tự đăng khi push lên `main`. Biến repo `API_URL` = địa chỉ backend |
| Backend | Render (free) | Tạo bằng Blueprint từ `render.yaml`; tự nhập `ConnectionStrings__Default`, `Admin__InitialPassword`, `Email__ResendApiKey` |
| Database | Neon (free) | Dán nguyên chuỗi `postgresql://...` của Neon vào `ConnectionStrings__Default` |

## Trang quản trị `/admin`

- **Đơn đăng ký**: xem đơn, gọi / mở Zalo, đổi trạng thái (Mới → Đã liên hệ → Đã nhập học), ghi chú.
- **Khoá học**: sửa nội dung, **học phí, lịch học, hình thức**, ẩn/hiện, thứ tự.
- **Tài liệu**: thêm/sửa tab và link Google Drive.
- **Cảm nhận**: thêm cảm nhận thật của học sinh / phụ huynh.
- **Tài khoản**: đổi mật khẩu.

Bảo mật: mật khẩu được mã hoá; sai 5 lần thì khoá 15 phút; phiên đăng nhập hết hạn sau 12 giờ.

## API

| Phương thức | Đường dẫn | Mô tả |
|---|---|---|
| GET | `/api/health` | Kiểm tra máy chủ |
| GET | `/api/courses` · `/api/documents` · `/api/testimonials` | Dữ liệu công khai cho trang chủ |
| POST | `/api/registrations` | Nhận đơn đăng ký (giới hạn 5 đơn / 10 phút / IP) |
| POST | `/api/auth/login` · `/api/auth/change-password` | Đăng nhập / đổi mật khẩu |
| * | `/api/admin/...` | Quản lý dữ liệu (cần đăng nhập) |

## Sửa nội dung

- **Khoá học, tài liệu, cảm nhận, đơn đăng ký**: qua trang `/admin`.
- **Tên, giới thiệu, số điện thoại, mạng xã hội**: file `frontend/src/data/site.js` (`SITE`, `ABOUT`).
- Đổi màu cả trang: bảng màu ở đầu `frontend/src/app/globals.css`. Ảnh: `frontend/public/images/`.

## Lộ trình
- [x] Bước 1: Khung dự án + trang chủ
- [x] Bước 2: Database + API, form đăng ký, nút Zalo, chính sách bảo mật
- [x] Bước 3: Trang quản trị `/admin` + thông báo email
- [ ] Bước 4: Đưa lên mạng (GitHub Pages + Render + Neon)
- [ ] Bước 5: Trắc nghiệm online (3 dạng câu thi TN THPT)
- [ ] Bước 6: Tài khoản học sinh, lớp học, bảo vệ tài liệu
