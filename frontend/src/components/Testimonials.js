"use client";

import { useApi } from "@/lib/api";
import SectionTitle from "./SectionTitle";

const CARD_COLORS = ["bg-sky/10", "bg-coral/10", "bg-mint/10", "bg-sun/15", "bg-brand/10"];

// Cảm nhận học sinh — chỉ hiện khi Thầy đã thêm ít nhất 1 cảm nhận trong database
export default function Testimonials() {
  const { data: items } = useApi("/api/testimonials", []);
  if (items.length === 0) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle eyebrow="Cảm nhận" title="Học sinh & phụ huynh nói gì?" />
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <figure key={t.id} className={`rounded-3xl p-7 ${CARD_COLORS[i % CARD_COLORS.length]}`}>
              <div className="font-display text-5xl leading-none text-brand">“</div>
              <blockquote className="mt-2 text-lg">{t.content}</blockquote>
              <figcaption className="mt-5">
                <div className="font-bold">{t.name}</div>
                <div className="text-sm text-muted">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
