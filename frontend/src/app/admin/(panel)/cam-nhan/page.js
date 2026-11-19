"use client";

import { useState } from "react";
import { adminFetch, useAdminData } from "@/lib/adminApi";
import { Button, Card, ErrorList, Field, Loading, PageHeader, Toggle, inputClass } from "@/components/admin/ui";

export default function TestimonialsPage() {
  const { data: items, errors: loadErrors, reload } = useAdminData("/api/admin/testimonials");
  const [editing, setEditing] = useState(null);
  const [actionErrors, setActionErrors] = useState([]);
  const errors = [...loadErrors, ...actionErrors];

  async function remove(t) {
    if (!confirm(`Xoá cảm nhận của "${t.name}"?`)) return;
    const res = await adminFetch(`/api/admin/testimonials/${t.id}`, { method: "DELETE" });
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
        title="Cảm nhận"
        description="Chỉ đăng cảm nhận thật, đã được học sinh / phụ huynh đồng ý. Chưa có cảm nhận nào thì mục này tự ẩn trên trang chủ."
        action={editing !== "new" && <Button onClick={() => setEditing("new")}>+ Thêm cảm nhận</Button>}
      />
      <ErrorList errors={errors} />
      {editing === "new" && (
        <TestimonialForm
          initial={{ name: "", role: "", content: "", sortOrder: (items?.length ?? 0) + 1, isPublished: true }}
          onDone={done}
          onCancel={() => setEditing(null)}
        />
      )}
      {items === null ? (
        <Loading />
      ) : items.length === 0 && editing !== "new" ? (
        <Card className="mt-4 py-10 text-center text-muted">Chưa có cảm nhận nào.</Card>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {items.map((t) =>
            editing === t.id ? (
              <TestimonialForm key={t.id} initial={t} onDone={done} onCancel={() => setEditing(null)} />
            ) : (
              <Card key={t.id}>
                <p className="text-lg">“{t.content}”</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold">{t.name}</span> <span className="text-sm text-muted">· {t.role}</span>
                    {!t.isPublished && <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 text-xs font-semibold">Đang ẩn</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setEditing(t.id)}>
                      Sửa
                    </Button>
                    <Button variant="danger" onClick={() => remove(t)}>
                      Xoá
                    </Button>
                  </div>
                </div>
              </Card>
            )
          )}
        </div>
      )}
    </>
  );
}

function TestimonialForm({ initial, onDone, onCancel }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm({ ...form, [key]: e?.target ? e.target.value : e });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const body = { ...form, sortOrder: Number(form.sortOrder) || 0 };
    const res = initial.id
      ? await adminFetch(`/api/admin/testimonials/${initial.id}`, { method: "PUT", body })
      : await adminFetch("/api/admin/testimonials", { method: "POST", body });
    setBusy(false);
    if (!res.ok) return setErrors(res.errors);
    onDone();
  }

  return (
    <Card className="ring-2 ring-brand/40 lg:col-span-2">
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-3">
        <Field label="Tên *">
          <input value={form.name} onChange={set("name")} required className={inputClass} placeholder="VD: Minh Anh" />
        </Field>
        <Field label="Vai trò">
          <input value={form.role} onChange={set("role")} className={inputClass} placeholder="VD: HS lớp 9, Phụ huynh em An" />
        </Field>
        <Field label="Thứ tự hiển thị">
          <input type="number" value={form.sortOrder} onChange={set("sortOrder")} className={inputClass} />
        </Field>
        <Field label="Nội dung cảm nhận *" className="md:col-span-3">
          <textarea value={form.content} onChange={set("content")} required rows={3} className={inputClass} />
        </Field>
        <div className="md:col-span-3">
          <Toggle checked={form.isPublished} onChange={set("isPublished")} label="Hiển thị trên trang web" />
        </div>
        <div className="md:col-span-3">
          <ErrorList errors={errors} />
        </div>
        <div className="flex justify-end gap-2 md:col-span-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Huỷ
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? "Đang lưu…" : "Lưu"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
