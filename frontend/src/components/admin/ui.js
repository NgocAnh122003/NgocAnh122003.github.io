"use client";

// Các thành phần giao diện dùng chung cho trang quản trị

export const inputClass =
  "w-full rounded-xl border-0 bg-white px-3.5 py-2.5 ring-1 ring-ink/15 outline-none transition focus:ring-2 focus:ring-brand";

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const BUTTON = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "bg-white text-ink ring-1 ring-ink/15 hover:bg-ink/5",
  danger: "bg-white text-coral ring-1 ring-coral/40 hover:bg-coral/10",
};

export function Button({ variant = "primary", className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${BUTTON[variant]} ${className}`}
    />
  );
}

export function Card({ className = "", children }) {
  return <div className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5 ${className}`}>{children}</div>;
}

export function ErrorList({ errors }) {
  if (!errors?.length) return null;
  return (
    <ul role="alert" className="space-y-1 rounded-xl bg-coral/10 p-3 text-sm text-coral">
      {errors.map((e) => (
        <li key={e}>⚠️ {e}</li>
      ))}
    </ul>
  );
}

export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl font-extrabold">{title}</h1>
        {description && <p className="text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export const PALETTE = [
  { value: "brand", label: "Tím", className: "bg-brand" },
  { value: "sky", label: "Xanh dương", className: "bg-sky" },
  { value: "mint", label: "Xanh ngọc", className: "bg-mint" },
  { value: "coral", label: "Hồng cam", className: "bg-coral" },
  { value: "sun", label: "Vàng", className: "bg-sun" },
];

export function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PALETTE.map((p) => (
        <button
          key={p.value}
          type="button"
          title={p.label}
          aria-label={p.label}
          aria-pressed={value === p.value}
          onClick={() => onChange(p.value)}
          className={`h-9 w-9 rounded-full ${p.className} ring-offset-2 transition ${
            value === p.value ? "ring-2 ring-ink" : "opacity-60 hover:opacity-100"
          }`}
        />
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-brand" />
      {label}
    </label>
  );
}

export function Loading() {
  return <p className="py-10 text-center text-muted">Đang tải…</p>;
}
