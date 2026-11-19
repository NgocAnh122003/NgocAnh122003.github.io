"use client";

import { useState } from "react";
import { adminFetch, useAdminData } from "@/lib/adminApi";
import { PALETTE, Button, Card, ErrorList, Field, Loading, PageHeader, Toggle, inputClass } from "@/components/admin/ui";

const NEW_ITEM = { subject: "", icon: "📘", color: "brand", link: "" };

export default function DocumentsPage() {
  const { data: groups, errors: loadErrors, reload } = useAdminData("/api/admin/documents");
  const [editing, setEditing] = useState(null); // id đang sửa, "new" = thêm tab mới
  const [actionErrors, setActionErrors] = useState([]);
  const errors = [...loadErrors, ...actionErrors];

  async function remove(g) {
    if (!confirm(`Xoá tab "${g.label}" và toàn bộ tài liệu bên trong?`)) return;
    const res = await adminFetch(`/api/admin/documents/${g.id}`, { method: "DELETE" });
    setActionErrors(res.ok ? [] : res.errors);
    if (res.ok) reload();
  }

  const done = () => {
    setEditing(null);
    reload();
  };

  return (
    <>
      <PageHeader
        title="Tài liệu"
        description="Mỗi tab (VD: KHTN 7) gồm nhiều ô tài liệu, mỗi ô dẫn tới một link Google Drive"
        action={editing !== "new" && <Button onClick={() => setEditing("new")}>+ Thêm tab</Button>}
      />
      <ErrorList errors={errors} />
      {editing === "new" && (
        <GroupForm
          initial={{ key: "", label: "", sortOrder: (groups?.length ?? 0) + 1, isPublished: true, items: [{ ...NEW_ITEM }] }}
          onDone={done}
          onCancel={() => setEditing(null)}
        />
      )}
      {groups === null ? (
        <Loading />
      ) : (
        <div className="mt-4 space-y-4">
          {groups.map((g) =>
            editing === g.id ? (
              <GroupForm key={g.id} initial={g} onDone={done} onCancel={() => setEditing(null)} />
            ) : (
              <Card key={g.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="font-display text-xl font-bold">
                    {g.label}{" "}
                    {!g.isPublished && <span className="ml-1 rounded-full bg-ink/10 px-2 py-0.5 text-xs font-semibold">Đang ẩn</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setEditing(g.id)}>
                      Sửa
                    </Button>
                    <Button variant="danger" onClick={() => remove(g)}>
                      Xoá
                    </Button>
                  </div>
                </div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                  {g.items.map((i) => (
                    <li key={i.id} className="rounded-xl bg-cream px-3 py-2 text-sm">
                      {i.icon} <span className="font-semibold">{i.subject}</span>
                      <div className={`truncate text-xs ${i.link ? "text-mint" : "text-coral"}`}>
                        {i.link ? "✓ Đã có link" : "Chưa có link"}
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            )
          )}
        </div>
      )}
    </>
  );
}

function GroupForm({ initial, onDone, onCancel }) {
  const [form, setForm] = useState({
    ...initial,
    items: initial.items.map((i) => ({ subject: i.subject, icon: i.icon, color: i.color, link: i.link ?? "" })),
  });
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  const setItem = (idx, key, value) =>
    setForm({ ...form, items: form.items.map((it, i) => (i === idx ? { ...it, [key]: value } : it)) });
  const moveItem = (idx, dir) => {
    const items = [...form.items];
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    [items[idx], items[j]] = [items[j], items[idx]];
    setForm({ ...form, items });
  };

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const body = {
      key: form.key,
      label: form.label,
      sortOrder: Number(form.sortOrder) || 0,
      isPublished: form.isPublished,
      items: form.items.map((i) => ({ ...i, link: i.link.trim() || null })),
    };
    const res = initial.id
      ? await adminFetch(`/api/admin/documents/${initial.id}`, { method: "PUT", body })
      : await adminFetch("/api/admin/documents", { method: "POST", body });
    setBusy(false);
    if (!res.ok) return setErrors(res.errors);
    onDone();
  }

  return (
    <Card className="ring-2 ring-brand/40">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Tên tab *" hint="VD: KHTN 7, Vật lý 10">
            <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required className={inputClass} />
          </Field>
          <Field label="Mã tab *" hint="Chữ thường không dấu, VD: khtn7">
            <input
              value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value })}
              required
              pattern="[a-z0-9\-]+"
              className={inputClass}
            />
          </Field>
          <Field label="Thứ tự hiển thị">
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
        <Toggle checked={form.isPublished} onChange={(v) => setForm({ ...form, isPublished: v })} label="Hiển thị trên trang web" />

        <div className="space-y-3">
          <div className="text-sm font-semibold">Các ô tài liệu</div>
          {form.items.map((item, idx) => (
            <div key={idx} className="grid gap-2 rounded-xl bg-cream p-3 md:grid-cols-[4rem_1fr_9rem_2fr_auto]">
              <input
                value={item.icon}
                onChange={(e) => setItem(idx, "icon", e.target.value)}
                aria-label="Emoji"
                className={`${inputClass} text-center`}
              />
              <input
                value={item.subject}
                onChange={(e) => setItem(idx, "subject", e.target.value)}
                required
                placeholder="Tên (VD: Vật lý)"
                className={inputClass}
              />
              <select value={item.color} onChange={(e) => setItem(idx, "color", e.target.value)} className={inputClass} aria-label="Màu">
                {PALETTE.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <input
                value={item.link}
                onChange={(e) => setItem(idx, "link", e.target.value)}
                type="url"
                placeholder="https://drive.google.com/… (để trống = Đang cập nhật)"
                className={inputClass}
              />
              <div className="flex gap-1">
                <Button type="button" variant="secondary" onClick={() => moveItem(idx, -1)} aria-label="Lên">
                  ↑
                </Button>
                <Button type="button" variant="secondary" onClick={() => moveItem(idx, 1)} aria-label="Xuống">
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })}
                  aria-label="Xoá ô"
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={() => setForm({ ...form, items: [...form.items, { ...NEW_ITEM }] })}>
            + Thêm ô tài liệu
          </Button>
        </div>

        <ErrorList errors={errors} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Huỷ
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? "Đang lưu…" : "Lưu tab"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
