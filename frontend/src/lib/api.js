"use client";

import { useEffect, useState } from "react";

// Địa chỉ backend .NET — cấu hình trong file .env.development / .env.production
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5170";

// Lấy dữ liệu từ API. Trong lúc chờ (hoặc khi API lỗi) dùng dữ liệu mẫu "fallback"
// để trang luôn hiển thị được, kể cả khi máy chủ miễn phí đang "ngủ".
// Trả về { data, status } với status: "loading" | "ready" | "error".
export function useApi(path, fallback) {
  const [state, setState] = useState({ data: fallback, status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch(API_URL + path)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((json) => {
        if (!cancelled) setState({ data: json, status: "ready" });
      })
      .catch(() => {
        // giữ dữ liệu mẫu
        if (!cancelled) setState((s) => ({ ...s, status: "error" }));
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}

// Gửi dữ liệu JSON lên API. Trả về { ok, data, errors }.
export async function postJson(path, body, timeoutMs = 60000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(API_URL + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => null);
    if (res.ok) return { ok: true, data };
    if (res.status === 429) return { ok: false, errors: ["Em gửi nhiều quá rồi, đợi ít phút rồi thử lại nhé."] };
    const errors = data?.errors
      ? Object.values(data.errors).flat()
      : [data?.detail ?? "Có lỗi xảy ra, em thử lại sau nhé."];
    return { ok: false, errors };
  } catch {
    return {
      ok: false,
      errors: ["Không kết nối được máy chủ. Em thử lại sau ít phút hoặc nhắn Zalo cho thầy nhé."],
    };
  } finally {
    clearTimeout(timer);
  }
}
