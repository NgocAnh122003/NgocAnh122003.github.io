"use client";

import { useState } from "react";
import { adminFetch, useAdminData } from "@/lib/adminApi";
import { COLORS } from "@/components/colors";
import {
  Button, Card, ColorPicker, ErrorList, Field, Loading, PageHeader, Toggle, inputClass,
} from "@/components/admin/ui";

const EMPTY = {
  title: "", level: "", icon: "📘", color: "brand", description: "", topics: [],
  price: "", schedule: "", format: "", sortOrder: 0, isPublished: true,
};

export default function CoursesPage() {
  const { data: items, errors: loadErrors, reload } = useAdminData("/api/admin/courses");
  const [editing, setEditing] = useState(null); // id đang sửa, "new" = thêm mới
  const [actionErrors, setActionErrors] = useState([]);
  const errors = [...loadErrors, ...actionErrors];

  async function remove(course) {
    if (!confirm(`Xoá khoá học "${course.title}"?`)) return;
    const res = await adminFetch(`/api/admin/courses/${course.id}`, { method: "DELETE" });
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
        title="Khoá học"
        description="Hiển thị ở mục “Khoá học” trên trang chủ"
        action={editing !== "new" && <Button onClick={() => setEditing("new")}>+ Thêm khoá học</Button>}
      />
      <ErrorList errors={errors} />
      {editing === "new" && (
        <CourseForm initial={{ ...EMPTY, sortOrder: (items?.length ?? 0) + 1 }} onDone={done} onCancel={() => setEditing(null)} />
      )}
      {items === null ? (
        <Loading />
      ) : (
        <div className="mt-4 space-y-4">
          {items.map((c) =>
            editing === c.id ? (
              <CourseForm key={c.id} initial={c} onDone={done} onCancel={() => setEditing(null)} />
            ) : (
              <Card key={c.id} className="flex flex-wrap items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${(COLORS[c.color] ?? COLORS.brand).soft}`}>
                  {c.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-lg font-bold">
                    {c.title}{" "}
                    {!c.isPublished && <span className="ml-1 rounded-full bg-ink/10 px-2 py-0.5 text-xs font-semibold">Đang ẩn</span>}
                  </div>
                  <div className="text-sm text-muted">
                    {c.level} · 💰 {c.price || "Chưa nhập học phí"} {c.schedule && `· 🗓️ ${c.schedule}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setEditing(c.id)}>
                    Sửa
                  </Button>
                  <Button variant="danger" onClick={() => remove(c)}>
                    Xoá
                  </Button>
                </div>
              </Card>
            )
          )}
        </div>
      )}
    </>
  );
}

function CourseForm({ initial, onDone, onCancel }) {
  const [form, setForm] = useState({
    ...initial,
    price: initial.price ?? "",
    schedule: initial.schedule ?? "",
    format: initial.format ?? "",
    topicsText: initial.topics.join("\n"),
  });
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm({ ...form, [key]: e?.target ? e.target.value : e });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const { topicsText, ...rest } = form;
    const body = { ...rest, sortOrder: Number(form.sortOrder) || 0, topics: topicsText.split("\n") };
    const res = initial.id
      ? await adminFetch(`/api/admin/courses/${initial.id}`, { method: "PUT", body })
      : await adminFetch("/api/admin/courses", { method: "POST", body });
    setBusy(false);
    if (!res.ok) return setErrors(res.errors);
    onDone();
  }

  return (
    <Card className="ring-2 ring-brand/40">
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <Field label="Tên khoá học *" className="md:col-span-2">
          <input value={form.title} onChange={set("title")} required className={inputClass} />
        </Field>
        <Field label="Nhãn cấp học" hint="VD: THCS, THPT, Luyện thi">
          <input value={form.level} onChange={set("level")} className={inputClass} />
        </Field>
        <Field label="Biểu tượng (emoji)" hint="Dán 1 emoji, VD: ⚛️ 🌱 🎯">
          <input value={form.icon} onChange={set("icon")} className={inputClass} />
        </Field>
        <Field label="Màu thẻ" className="md:col-span-2">
          <ColorPicker value={form.color} onChange={set("color")} />
        </Field>
        <Field label="Mô tả ngắn" className="md:col-span-2">
          <textarea value={form.description} onChange={set("description")} rows={2} className={inputClass} />
        </Field>
        <Field label="Nội dung chính" hint="Mỗi dòng là một ý" className="md:col-span-2">
          <textarea value={form.topicsText} onChange={set("topicsText")} rows={4} className={inputClass} />
        </Field>
        <Field label="💰 Học phí" hint="VD: 800.000đ / tháng. Để trống = “Liên hệ để được tư vấn”">
          <input value={form.price} onChange={set("price")} className={inputClass} />
        </Field>
        <Field label="🗓️ Lịch học" hint="VD: 2 buổi/tuần · 90 phút/buổi">
          <input value={form.schedule} onChange={set("schedule")} className={inputClass} />
        </Field>
        <Field label="👥 Hình thức" hint="VD: Nhóm ≤ 8 HS · Online/Offline">
          <input value={form.format} onChange={set("format")} className={inputClass} />
        </Field>
        <Field label="Thứ tự hiển thị" hint="Số nhỏ đứng trước">
          <input type="number" value={form.sortOrder} onChange={set("sortOrder")} className={inputClass} />
        </Field>
        <div className="md:col-span-2">
          <Toggle checked={form.isPublished} onChange={set("isPublished")} label="Hiển thị trên trang web" />
        </div>
        <div className="md:col-span-2">
          <ErrorList errors={errors} />
        </div>
        <div className="flex justify-end gap-2 md:col-span-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Huỷ
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? "Đang lưu…" : "Lưu khoá học"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
