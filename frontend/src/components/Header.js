"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV, SITE } from "@/data/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled || open ? "bg-white/90 shadow-sm backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image src="/images/logo-icon.png" alt="" width={36} height={36} priority />
          <span className="font-display text-2xl font-extrabold tracking-wide">
            DV<span className="text-brand">NA</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 font-medium text-ink/80 hover:bg-brand/10 hover:text-brand"
            >
              {item.label}
            </a>
          ))}
          <a
            href={SITE.socials.zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-full bg-brand px-5 py-2 font-semibold text-white shadow-md shadow-brand/30 hover:bg-brand-dark"
          >
            Nhắn Zalo
          </a>
        </nav>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-brand/10 px-4 pb-4 md:hidden">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 font-medium hover:bg-brand/10"
            >
              {item.label}
            </a>
          ))}
          <a
            href={SITE.socials.zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block rounded-xl bg-brand px-4 py-3 text-center font-semibold text-white"
          >
            Nhắn Zalo cho thầy
          </a>
        </nav>
      )}
    </header>
  );
}
