import { SITE } from "@/data/site";

// Nút Zalo nổi ở góc phải màn hình
export default function FloatingZalo() {
  return (
    <a
      href={SITE.socials.zalo}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nhắn Zalo cho thầy"
      className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-sky py-3 pr-5 pl-3 font-semibold text-white shadow-xl shadow-sky/40 transition hover:-translate-y-1"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white font-display text-sm font-extrabold text-sky">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/60" />
        <span className="relative">Zalo</span>
      </span>
      <span className="hidden sm:inline">Nhắn thầy</span>
    </a>
  );
}
