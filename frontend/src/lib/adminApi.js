"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { API_URL } from "./api";

const KEY = "dvna_admin_session";
const EVENT = "dvna-session-change";

// ===== Phiên đăng nhập lưu trong trình duyệt của Thầy: { token, expiresAt, username } =====

function readRaw() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function parse(raw) {
  try {
    const s = JSON.parse(raw);
    if (s && new Date(s.expiresAt) > new Date()) return s;
  } catch {
    /* dữ liệu hỏng thì coi như chưa đăng nhập */
  }
  return null;
}

function notify() {
  window.dispatchEvent(new Event(EVENT));
}

export function getSession() {
  return parse(readRaw());
}

export function saveSession(session) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* trình duyệt chặn lưu trữ */
  }
  notify();
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* bỏ qua */
  }
  notify();
}

function subscribe(callback) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// Trả về: undefined = đang kiểm tra (lúc dựng trang), null = chưa đăng nhập, object = đã đăng nhập
export function useSession() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => undefined);
  return useMemo(() => (raw === undefined ? undefined : parse(raw)), [raw]);
}

// ===== Gọi API =====

// Gọi API quản trị kèm vé đăng nhập. Trả về { ok, data, errors }.
// Hết phiên (401) thì xoá phiên → khung quản trị tự chuyển về trang đăng nhập.
export async function adminFetch(path, { method = "GET", body } = {}) {
  const session = getSession();
  const headers = { "Content-Type": "application/json" };
  if (session) headers.Authorization = `Bearer ${session.token}`;

  try {
    const res = await fetch(API_URL + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (res.status === 401 && !path.startsWith("/api/auth/login")) {
      clearSession();
      return { ok: false, errors: ["Phiên đăng nhập đã hết hạn"] };
    }

    const data = res.status === 204 ? null : await res.json().catch(() => null);
    if (res.ok) return { ok: true, data };
    if (res.status === 429) return { ok: false, errors: ["Thao tác quá nhiều lần, vui lòng đợi vài phút."] };
    const errors = data?.errors ? Object.values(data.errors).flat() : [`Lỗi máy chủ (${res.status})`];
    return { ok: false, errors };
  } catch {
    return { ok: false, errors: ["Không kết nối được máy chủ. Kiểm tra backend đã chạy chưa."] };
  }
}

// Tải dữ liệu cho một trang quản trị. Trả về { data, errors, reload }.
export function useAdminData(path) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ data: null, errors: [] });

  useEffect(() => {
    let cancelled = false;
    adminFetch(path).then((res) => {
      if (cancelled) return;
      setState((prev) => (res.ok ? { data: res.data, errors: [] } : { data: prev.data, errors: res.errors }));
    });
    return () => {
      cancelled = true;
    };
  }, [path, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, reload };
}
