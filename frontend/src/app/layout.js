import { Baloo_2, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { SITE } from "@/data/site";

// Font hỗ trợ tiếng Việt: Baloo 2 cho tiêu đề, Be Vietnam Pro cho nội dung
const heading = Baloo_2({
  variable: "--font-heading",
  subsets: ["vietnamese", "latin"],
  weight: ["600", "700", "800"],
});

const body = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.teacherName} – KHTN & Vật lý | ${SITE.brand}`,
  description: SITE.description,
  keywords: [
    "Đoàn Vũ Ngọc Ánh",
    "DVNA",
    "Khoa học tự nhiên",
    "KHTN 7 8 9",
    "Vật lý 10 11 12",
    "luyện thi tốt nghiệp THPT",
    "gia sư Vật lý Hà Nội",
  ],
  openGraph: {
    title: `${SITE.teacherName} – KHTN & Vật lý`,
    description: SITE.description,
    images: ["/images/profile.webp"],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${heading.variable} ${body.variable} antialiased`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
