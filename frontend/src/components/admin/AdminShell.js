"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, useSession } from "@/lib/adminApi";

const MENU = [
  { href: "/admin", label: "Đơn đăng ký", icon: "📥" },
  { href: "/admin/khoa-hoc", label: "Khoá học", icon: "📚" },
  { href: "/admin/tai-lieu", label: "Tài liệu", icon: "📂" },
  { href: "/admin/cam-nhan", label: "Cảm nhận", icon: "💬" },
  { href: "/admin/tai-khoan", label: "Tài khoản", icon: "🔒" },
];

// Khung trang quản trị: kiểm tra đăng nhập + thanh menu
export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();

  // Chưa đăng nhập / hết phiên → về trang đăng nhập
  useEffect(() => {
    if (session === null) router.replace("/admin/login");
  }, [session, router]);

  function logout() {
    clearSession();
  }

  if (!session) return null;

  const isActive = (href) => (href === "/admin" ? pathname === "/admin" || pathname === "/admin/" : pathname.startsWith(href));

  return (
    <div className="md:flex">
      <aside className="sticky top-0 z-30 bg-ink text-white md:h-screen md:w-60 md:shrink-0">
        <div className="flex items-center justify-between px-4 py-3 md:block md:px-5 md:py-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/images/logo-icon.png" alt="" width={32} height={32} />
            <span className="font-display text-xl font-extrabold">
              DV<span className="text-sun">NA</span> <span className="text-sm font-semibold text-white/60">Quản trị</span>
            </span>
          </Link>
          <button onClick={logout} className="text-sm text-white/70 hover:text-white md:hidden">
            Đăng xuất
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:block md:space-y-1 md:px-3">
          {MENU.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition md:py-2.5 ${
                isActive(m.href) ? "bg-white text-ink" : "text-white/80 hover:bg-white/10"
              }`}
            >
              <span>{m.icon}</span>
              {m.label}
            </Link>
          ))}
        </nav>
        <div className="hidden px-5 pt-6 text-sm text-white/60 md:block">
          <div>Xin chào, {session.username}</div>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/" target="_blank" className="hover:text-white">
              ↗ Xem trang web
            </Link>
            <button onClick={logout} className="text-left hover:text-white">
              ⎋ Đăng xuất
            </button>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
