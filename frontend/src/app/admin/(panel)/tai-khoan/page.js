"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { Button, Card, ErrorList, Field, PageHeader, inputClass } from "@/components/admin/ui";

export default function AccountPage() {
  const [errors, setErrors] = useState([]);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    setDone(false);
    if (form.get("newPassword") !== form.get("confirm")) return setErrors(["Mật khẩu nhập lại không khớp"]);

    setBusy(true);
    const res = await adminFetch("/api/auth/change-password", {
      method: "POST",
      body: { currentPassword: form.get("currentPassword"), newPassword: form.get("newPassword") },
    });
    setBusy(false);
    if (!res.ok) return setErrors(res.errors);
    setErrors([]);
    setDone(true);
    formEl.reset();
  }

  return (
    <>
      <PageHeader title="Tài khoản" description="Đổi mật khẩu đăng nhập trang quản trị" />
      <Card className="max-w-md">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Mật khẩu hiện tại">
            <input name="currentPassword" type="password" required autoComplete="current-password" className={inputClass} />
          </Field>
          <Field label="Mật khẩu mới" hint="Ít nhất 8 ký tự, nên có chữ hoa, chữ thường và số">
            <input name="newPassword" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
          </Field>
          <Field label="Nhập lại mật khẩu mới">
            <input name="confirm" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
          </Field>
          <ErrorList errors={errors} />
          {done && <p className="rounded-xl bg-mint/10 p-3 text-sm font-semibold text-mint">✓ Đã đổi mật khẩu thành công</p>}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Đang lưu…" : "Đổi mật khẩu"}
          </Button>
        </form>
      </Card>
    </>
  );
}
