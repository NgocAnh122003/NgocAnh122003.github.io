export const metadata = {
  title: "Quản trị | DVNA",
  // Không cho Google đánh chỉ mục trang quản trị
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-[#f6f5fb]">{children}</div>;
}
