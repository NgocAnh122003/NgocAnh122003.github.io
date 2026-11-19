import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/data/site";

export const metadata = {
  title: `Chính sách bảo mật | ${SITE.brand}`,
  description: "Cách website của Thầy Ngọc Ánh thu thập, sử dụng và bảo vệ thông tin cá nhân.",
};

const SECTIONS = [
  {
    title: "1. Thông tin thầy thu thập",
    body: [
      "Khi em hoặc phụ huynh gửi form “Đăng ký học thử”, website lưu: họ tên học sinh, số điện thoại, lớp và lời nhắn (nếu có), cùng thời điểm gửi.",
      "Website không thu thập thông tin thanh toán, không dùng cookie quảng cáo.",
    ],
  },
  {
    title: "2. Mục đích sử dụng",
    body: [
      "Thông tin chỉ dùng để thầy liên hệ tư vấn khoá học, xếp lịch học thử và trao đổi về việc học.",
      "Thầy không bán, không cho thuê và không chia sẻ thông tin của em cho bất kỳ ai vì mục đích quảng cáo.",
    ],
  },
  {
    title: "3. Lưu trữ và bảo mật",
    body: [
      "Dữ liệu được lưu trong cơ sở dữ liệu có bảo vệ, chỉ thầy truy cập được qua trang quản trị có mật khẩu.",
      "Khi có đăng ký mới, thông tin được gửi tới hộp thư email riêng của thầy để thầy liên hệ kịp thời.",
      "Website sử dụng dịch vụ lưu trữ của bên thứ ba (máy chủ, cơ sở dữ liệu) để vận hành.",
      "Thông tin được giữ tối đa 24 tháng kể từ lần liên hệ cuối, hoặc xoá sớm hơn khi em / phụ huynh yêu cầu.",
    ],
  },
  {
    title: "4. Học sinh dưới 16 tuổi",
    body: [
      "Với học sinh dưới 16 tuổi, thầy đề nghị phụ huynh hoặc người giám hộ là người gửi đăng ký, hoặc biết và đồng ý với việc gửi thông tin.",
    ],
  },
  {
    title: "5. Quyền của em và phụ huynh",
    body: [
      "Em / phụ huynh có quyền yêu cầu xem, sửa hoặc xoá thông tin đã gửi, và rút lại sự đồng ý bất cứ lúc nào.",
      `Chỉ cần nhắn Zalo ${SITE.phone} hoặc gửi email tới ${SITE.email}, thầy sẽ xử lý trong vòng 72 giờ.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="dots-bg pt-28 pb-20">
        <article className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5 md:p-10">
          <h1 className="font-display text-4xl font-extrabold">Chính sách bảo mật</h1>
          <p className="mt-2 text-muted">Cập nhật: 11/2026 · Website của {SITE.teacherName} ({SITE.fullName})</p>
          {SECTIONS.map((s) => (
            <section key={s.title} className="mt-8">
              <h2 className="font-display text-2xl font-bold text-brand">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </>
  );
}
