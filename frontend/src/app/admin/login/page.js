"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { adminFetch, saveSession, useSession } from "@/lib/adminApi";
import { Button, ErrorList, Field, inputClass } from "@/components/admin/ui";

export default function LoginPage() {
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);
  const session = useSession();

  // Đã đăng nhập rồi thì vào thẳng trang quản trị
  useEffect(() => {
    if (session) router.replace("/admin");
  }, [session, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setErrors([]);
    const res = await adminFetch("/api/auth/login", {
      method: "POST",
      body: { username: form.get("username"), password: form.get("password") },
    });
    setBusy(false);
    if (!res.ok) return setErrors(res.errors);
    saveSession(res.data); // → useEffect ở trên sẽ chuyển vào trang quản trị
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-8 shadow-xl ring-1 ring-ink/5">
        <div className="text-center">
          <Image src="/images/logo-icon.png" alt="" width={56} height={56} className="mx-auto" />
          <h1 className="mt-3 font-display text-2xl font-extrabold">Quản trị DVNA</h1>
          <p className="text-sm text-muted">Dành riêng cho giáo viên</p>
        </div>
        <Field label="Tên đăng nhập">
          <input name="username" required autoComplete="username" className={inputClass} />
        </Field>
        <Field label="Mật khẩu">
          <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
        </Field>
        <ErrorList errors={errors} />
        <Button type="submit" disabled={busy} className="w-full py-3">
          {busy ? "Đang đăng nhập…" : "Đăng nhập"}
        </Button>
      </form>
    </main>
  );
}
