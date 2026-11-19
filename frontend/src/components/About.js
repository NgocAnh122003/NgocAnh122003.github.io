import Image from "next/image";
import { ABOUT, SITE } from "@/data/site";
import SectionTitle from "./SectionTitle";

export default function About() {
  return (
    <section id="gioi-thieu" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle eyebrow="Giới thiệu" title="Người đồng hành cùng các em" />

        <div className="grid items-center gap-12 md:grid-cols-[2fr_3fr]">
          <div className="reveal relative mx-auto w-full max-w-xs">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] bg-sun" />
            <Image
              src="/images/profile.webp"
              alt={`Chân dung ${SITE.fullName}`}
              width={600}
              height={800}
              className="relative rounded-[2rem] border-4 border-white shadow-xl"
            />
          </div>

          <div className="reveal">
            <h3 className="font-display text-3xl font-extrabold">
              {SITE.fullName}
            </h3>
            <p className="mt-1 font-semibold text-brand">Giáo viên KHTN & Vật lý · Kỹ sư CNTT</p>
            {ABOUT.paragraphs.map((p) => (
              <p key={p} className="mt-4 text-lg leading-relaxed text-muted">
                {p}
              </p>
            ))}

            <div className="mt-8 grid grid-cols-2 gap-4">
              {ABOUT.highlights.map((h) => (
                <div key={h.title} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
                  <div className="text-3xl">{h.icon}</div>
                  <div className="mt-2 font-bold">{h.title}</div>
                  <div className="text-sm text-muted">{h.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
