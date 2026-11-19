"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/data/site";
import { postJson } from "@/lib/api";
import SectionTitle from "./SectionTitle";

const GRADES = ["Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12", "Khác"];

const inputClass =
  "w-full rounded-2xl border-0 bg-cream px-4 py-3.5 ring-1 ring-ink/10 outline-none transition focus:ring-2 focus:ring-brand";

export default function Contact() {
  // idle | sending | sent
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setErrors([]);

    const result = await postJson("/api/registrations", {
      studentName: form.get("studentName"),
      phone: form.get("phone"),
      grade: form.get("grade"),
      message: form.get("message"),
      consent: form.get("consent") === "on",
      website: form.get("website"),
    });

    if (result.ok) {
      setStatus("sent");
    } else {
      setStatus("idle");
      setErrors(result.errors);
    }
  }

  const contacts = [
    { icon: "📞", label: "Điện thoại / Zalo", value: SITE.phone, href: `tel:${SITE.phoneRaw}` },
    { icon: "✉️", label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: "📍", label: "Địa điểm", value: `${SITE.address} · Online` },
  ];

  const socials = [
    { label: "Zalo", href: SITE.socials.zalo, className: "bg-sky" },
    { label: "Facebook", href: SITE.socials.facebook, className: "bg-[#1877f2]" },
    { label: "TikTok", href: SITE.socials.tiktok, className: "bg-ink" },
    { label: "Instagram", href: SITE.socials.instagram, className: "bg-coral" },
  ];

  return (
    <section id="lien-he" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle eyebrow="Liên hệ" title="Đăng ký học thử miễn phí">
          Để lại thông tin, thầy sẽ liên hệ tư vấn lộ trình phù hợp cho em
        </SectionTitle>

        <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
          <div className="reveal rounded-3xl bg-gradient-to-br from-brand to-sky p-8 text-white">
            <h3 className="font-display text-2xl font-extrabold">Thông tin liên hệ</h3>
            <p className="mt-2 text-white/80">Phụ huynh và các em cứ nhắn thầy bất cứ lúc nào nhé!</p>
            <ul className="mt-6 space-y-4">
              {contacts.map((c) => (
                <li key={c.label} className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                    {c.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm text-white/70">{c.label}</div>
                    {c.href ? (
                      <a href={c.href} className="font-semibold break-all hover:underline">
                        {c.value}
                      </a>
                    ) : (
                      <div className="font-semibold">{c.value}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-full px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:-translate-y-0.5 ${s.className}`}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="reveal rounded-3xl bg-white p-6 shadow-xl ring-1 ring-ink/5 md:p-8">
            {status === "sent" ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="text-6xl">🎉</div>
                <h3 className="mt-4 font-display text-2xl font-extrabold">Cảm ơn em đã đăng ký!</h3>
                <p className="mt-2 max-w-sm text-muted">
                  Thầy đã nhận được thông tin và sẽ liên hệ lại sớm. Cần gấp thì nhắn Zalo{" "}
                  <a href={SITE.socials.zalo} className="font-semibold text-brand">
                    {SITE.phone}
                  </a>{" "}
                  nhé.
                </p>
                <button onClick={() => setStatus("idle")} className="mt-6 font-semibold text-brand hover:underline">
                  Gửi thêm đăng ký khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-semibold">Họ và tên học sinh *</span>
                  <input name="studentName" required minLength={2} maxLength={100} className={inputClass} placeholder="Nguyễn Văn A" />
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-semibold">Số điện thoại *</span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    pattern="(\+?84|0)[0-9 .]{8,13}"
                    title="Số điện thoại Việt Nam, VD: 0912 345 678"
                    className={inputClass}
                    placeholder="09xx xxx xxx"
                  />
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-semibold">Lớp *</span>
                  <select name="grade" required defaultValue="" className={inputClass}>
                    <option value="" disabled>
                      Chọn lớp
                    </option>
                    {GRADES.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-semibold">Lời nhắn</span>
                  <textarea
                    name="message"
                    rows={4}
                    maxLength={1000}
                    className={inputClass}
                    placeholder="Em muốn học online hay trực tiếp, lịch rảnh, mục tiêu điểm số…"
                  />
                </label>

                {/* Ô bẫy chống spam — người thật không nhìn thấy */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <label className="flex items-start gap-3 text-sm sm:col-span-2">
                  <input name="consent" type="checkbox" required className="mt-0.5 h-5 w-5 shrink-0 accent-brand" />
                  <span className="text-muted">
                    Em / phụ huynh đồng ý để thầy lưu thông tin trên nhằm liên hệ tư vấn, theo{" "}
                    <Link href="/chinh-sach-bao-mat" className="font-semibold text-brand hover:underline">
                      chính sách bảo mật
                    </Link>
                    .
                  </span>
                </label>

                {errors.length > 0 && (
                  <ul role="alert" className="space-y-1 rounded-2xl bg-coral/10 p-4 text-sm text-coral sm:col-span-2">
                    {errors.map((err) => (
                      <li key={err}>⚠️ {err}</li>
                    ))}
                  </ul>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="rounded-full bg-coral py-4 font-semibold text-white shadow-lg shadow-coral/30 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 sm:col-span-2"
                >
                  {status === "sending" ? "Đang gửi…" : "Gửi đăng ký ✈️"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
