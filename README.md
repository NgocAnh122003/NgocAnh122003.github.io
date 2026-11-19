# DVNA – Website học tập của Thầy Đoàn Vũ Ngọc Ánh

Website giới thiệu, khoá học và tài liệu KHTN 7–9 & Vật lý 10–11–12.

```
DVNAWEB/
├── frontend/   ← Next.js (giao diện + trang quản trị /admin) → đăng lên GitHub Pages
└── backend/    ← ASP.NET Core 9 Web API + SQL Server → đăng lên Render
```

## Chạy trên máy

**Backend** (cần .NET 9 SDK):
```bash
cd backend
dotnet run --launch-profile http   # kiểm tra: http://localhost:5170/api/health
```
Lần chạy đầu, backend tự tạo database `DvnaEdu` trong `.\SQLEXPRESS`, nạp dữ liệu ban đầu
và tạo tài khoản quản trị.

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
| `Email:Username` | Địa chỉ Gmail dùng để **gửi** thông báo |
| `Email:Password` | **Mật khẩu ứng dụng** của Gmail đó (không phải mật khẩu Gmail thường) |

Email **nhận** thông báo: `Email:To` trong `backend/appsettings.json` (mặc định `dvna010203@gmail.com`).

## Bật thông báo email khi có đơn đăng ký

1. Bật **xác minh 2 bước** cho tài khoản Gmail: <https://myaccount.google.com/security>
2. Tạo **mật khẩu ứng dụng**: <https://myaccount.google.com/apppasswords> → đặt tên "DVNA web" → Google cho một mã 16 ký tự.
3. Lưu vào máy (tự gõ trong terminal của Thầy, đừng gửi mã này cho ai):
   ```bash
   cd backend
   dotnet user-secrets set "Email:Username" "email-gui@gmail.com"
   dotnet user-secrets set "Email:Password" "mã 16 ký tự"
   ```
4. Khởi động lại backend. Chưa cấu hình thì đơn vẫn được lưu, chỉ không gửi mail.

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
- [x] Bước 2: Database SQL Server + API, form đăng ký, nút Zalo, chính sách bảo mật
- [x] Bước 3: Trang quản trị `/admin` + thông báo email
- [ ] Bước 4: Đưa lên mạng (GitHub Pages + Render + Azure SQL)
- [ ] Bước 5: Trắc nghiệm online (3 dạng câu thi TN THPT)
- [ ] Bước 6: Tài khoản học sinh, lớp học, bảo vệ tài liệu
