"use client";

import { useState } from "react";
import { DOCUMENT_GROUPS } from "@/data/site";
import { useApi } from "@/lib/api";
import { COLORS } from "./colors";
import SectionTitle from "./SectionTitle";

export default function Documents() {
  const { data: groups, status } = useApi("/api/documents", DOCUMENT_GROUPS);
  const [activeKey, setActiveKey] = useState(DOCUMENT_GROUPS[0].key);
  const group = groups.find((g) => g.key === activeKey) ?? groups[0];

  return (
    <section id="tai-lieu" className="dots-bg py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle eyebrow="Tài liệu miễn phí" title="Kho học liệu của thầy">
          Lý thuyết, bài tập tự luyện và đề kiểm tra — bám sát chương trình GDPT 2018
        </SectionTitle>

        <div className="reveal mb-8 flex flex-wrap justify-center gap-2" role="tablist">
          {groups.map((g) => (
            <button
              key={g.key}
              role="tab"
              aria-selected={g.key === group?.key}
              onClick={() => setActiveKey(g.key)}
              className={`rounded-full px-5 py-2.5 font-semibold transition ${
                g.key === group?.key
                  ? "bg-ink text-white shadow-lg"
                  : "bg-white text-ink ring-1 ring-ink/10 hover:ring-brand/40"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {group && (
          <div className="grid gap-5 sm:grid-cols-3">
            {group.items.map((item) => {
              const c = COLORS[item.color] ?? COLORS.brand;
              const ready = Boolean(item.link);
              const note = ready
                ? `${group.label} · Mở Google Drive →`
                : status === "loading"
                  ? "Đang tải…"
                  : "Đang cập nhật…";
              return (
                <a
                  key={item.subject}
                  href={ready ? item.link : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!ready}
                  className={`flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5 transition ${
                    ready ? "hover:-translate-y-1 hover:shadow-xl" : "cursor-not-allowed opacity-70"
                  }`}
                >
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${c.soft}`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-xl font-bold">{item.subject}</div>
                    <div className={`text-sm font-semibold ${ready ? c.text : "text-muted"}`}>{note}</div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
