import Image from "next/image";
import { SITE } from "@/data/site";
import TypingText from "./TypingText";

// Các "nhãn" công thức trôi quanh ảnh
const CHIPS = [
  { text: "pV = nRT", className: "left-0 top-10 bg-sky text-white float" },
  { text: "H₂O", className: "right-2 top-4 bg-coral text-white float-slow" },
  { text: "🧬 ADN", className: "left-0 bottom-24 bg-mint text-white float-slow" },
  { text: "⚛️ Hạt nhân", className: "right-0 bottom-16 bg-sun text-ink float" },
];

export default function Hero() {
  return (
    <section className="dots-bg relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Mảng màu trang trí */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-sun/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand shadow-sm ring-1 ring-brand/15">
            👋 Xin chào các em!
          </span>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] font-extrabold md:text-6xl">
            Mình là <span className="text-brand">{SITE.teacherName}</span>
          </h1>
          <p className="mt-4 h-9 font-display text-2xl font-bold text-coral md:text-3xl">
            <TypingText words={SITE.roles} />
          </p>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted md:mx-0">{SITE.intro}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href="#lien-he"
              className="rounded-full bg-brand px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              Đăng ký học thử
            </a>
            <a
              href="#tai-lieu"
              className="rounded-full bg-white px-7 py-3.5 font-semibold text-ink shadow-md ring-1 ring-ink/10 transition hover:-translate-y-0.5"
            >
              📚 Tài liệu miễn phí
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm md:max-w-md">
          <div className="absolute inset-x-6 bottom-0 top-16 rounded-[3rem] bg-gradient-to-br from-brand via-sky to-mint" />
          <div className="absolute inset-x-10 bottom-4 top-24 rotate-6 rounded-[3rem] border-4 border-dashed border-white/50" />
          <Image
            src="/images/hero.webp"
            alt={SITE.fullName}
            width={640}
            height={920}
            priority
            className="relative mx-auto w-[78%] drop-shadow-2xl"
          />
          {CHIPS.map((chip) => (
            <span
              key={chip.text}
              className={`absolute rounded-2xl px-4 py-2 font-display text-lg font-bold shadow-lg ${chip.className}`}
            >
              {chip.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
