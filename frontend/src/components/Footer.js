import Link from "next/link";
import { NAV, SITE } from "@/data/site";

export default function Footer() {
  return (
    <footer className="bg-ink pt-14 pb-8 text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-3">
        <div>
          <div className="font-display text-3xl font-extrabold text-white">
            DV<span className="text-sun">NA</span>
          </div>
          <p className="mt-3">
            {SITE.teacherName} – đồng hành cùng các em học Khoa học tự nhiên và Vật lý. Keep learning 🚀
          </p>
        </div>
        <div>
          <h4 className="font-display text-xl font-bold text-white">Liên kết nhanh</h4>
          <ul className="mt-3 space-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-sun">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xl font-bold text-white">Liên hệ</h4>
          <ul className="mt-3 space-y-2">
            <li>📞 {SITE.phone}</li>
            <li className="break-all">✉️ {SITE.email}</li>
            <li>📍 {SITE.address}</li>
          </ul>
        </div>
      </div>
      <p className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/50">
        © {new Date().getFullYear()} {SITE.fullName} · {SITE.brand} ·{" "}
        <Link href="/chinh-sach-bao-mat" className="hover:text-sun">
          Chính sách bảo mật
        </Link>
      </p>
    </footer>
  );
}
