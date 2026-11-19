"use client";

import { useState } from "react";
import { adminFetch, useAdminData } from "@/lib/adminApi";
import { Button, Card, ErrorList, Loading, PageHeader, inputClass } from "@/components/admin/ui";

const STATUSES = [
  { value: "New", label: "Mới", className: "bg-coral text-white" },
  { value: "Contacted", label: "Đã liên hệ", className: "bg-sun text-ink" },
  { value: "Enrolled", label: "Đã nhập học", className: "bg-mint text-white" },
  { value: "Closed", label: "Không theo học", className: "bg-ink/20 text-ink" },
];
const statusOf = (v) => STATUSES.find((s) => s.value === v) ?? STATUSES[0];

const formatTime = (iso) =>
  new Date(iso).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" });

export default function RegistrationsPage() {
  const [filter, setFilter] = useState("");
  const list = useAdminData(`/api/admin/registrations${filter ? `?status=${filter}` : ""}`);
  const { data: summary, reload: reloadSummary } = useAdminData("/api/admin/registrations/summary");
  const items = list.data;
  const errors = list.errors;
  const load = () => {
    list.reload();
    reloadSummary();
  };

  const count = (value) => (summary ? summary[value.charAt(0).toLowerCase() + value.slice(1)] : 0);

  return (
    <>
      <PageHeader title="Đơn đăng ký" description="Học sinh / phụ huynh gửi từ form “Đăng ký học thử”" />

      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip active={filter === ""} onClick={() => setFilter("")}>
          Tất cả {summary && `(${summary.total})`}
        </FilterChip>
        {STATUSES.map((s) => (
          <FilterChip key={s.value} active={filter === s.value} onClick={() => setFilter(s.value)}>
            {s.label} {summary && `(${count(s.value)})`}
          </FilterChip>
        ))}
      </div>

      <ErrorList errors={errors} />
      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <Card className="py-10 text-center text-muted">Chưa có đơn nào.</Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((r) => (
            <RegistrationCard key={r.id} item={r} onChanged={load} />
          ))}
        </div>
      )}
    </>
  );
}

function FilterChip({ active, ...props }) {
  return (
    <button
      {...props}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
        active ? "bg-ink text-white" : "bg-white ring-1 ring-ink/10 hover:ring-brand/40"
      }`}
    />
  );
}

function RegistrationCard({ item, onChanged }) {
  const [status, setStatus] = useState(item.status);
  const [note, setNote] = useState(item.note ?? "");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState([]);
  const dirty = status !== item.status || note !== (item.note ?? "");
  const phone = item.phone.replace(/[^\d+]/g, "");
  const s = statusOf(item.status);

  async function save() {
    setBusy(true);
    const res = await adminFetch(`/api/admin/registrations/${item.id}`, { method: "PATCH", body: { status, note } });
    setBusy(false);
    if (!res.ok) return setErrors(res.errors);
    setErrors([]);
    onChanged();
  }

  async function remove() {
    if (!confirm(`Xoá đơn của "${item.studentName}"? Không thể hoàn tác.`)) return;
    const res = await adminFetch(`/api/admin/registrations/${item.id}`, { method: "DELETE" });
    if (!res.ok) return setErrors(res.errors);
    onChanged();
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-display text-xl font-bold">{item.studentName}</div>
          <div className="text-sm text-muted">
            {item.grade} · {formatTime(item.createdAt)} · #{item.id}
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${s.className}`}>{s.label}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <a href={`tel:${phone}`} className="rounded-xl bg-mint/10 px-3 py-2 text-sm font-semibold text-mint">
          📞 {item.phone}
        </a>
        <a
          href={`https://zalo.me/${phone.replace(/^\+?84/, "0")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-sky/10 px-3 py-2 text-sm font-semibold text-sky"
        >
          💬 Mở Zalo
        </a>
      </div>

      {item.message && <p className="mt-3 rounded-xl bg-cream p-3 text-sm whitespace-pre-line">“{item.message}”</p>}

      <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr]">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
          {STATUSES.map((x) => (
            <option key={x.value} value={x.value}>
              {x.label}
            </option>
          ))}
        </select>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú riêng (VD: hẹn học thử thứ 7)"
          className={inputClass}
        />
      </div>
      <ErrorList errors={errors} />
      <div className="mt-3 flex justify-between gap-2">
        <Button variant="danger" onClick={remove}>
          Xoá
        </Button>
        <Button onClick={save} disabled={!dirty || busy}>
          {busy ? "Đang lưu…" : "Lưu"}
        </Button>
      </div>
    </Card>
  );
}
