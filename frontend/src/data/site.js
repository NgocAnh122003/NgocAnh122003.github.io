// ============================================================
//  DỮ LIỆU CỦA WEBSITE
//  - SITE, ABOUT, NAV: sửa trực tiếp trong file này.
//  - COURSES, DOCUMENT_GROUPS: dữ liệu thật lấy từ backend (database);
//    bản ở đây chỉ là dữ liệu dự phòng khi máy chủ chưa phản hồi.
// ============================================================

export const SITE = {
  url: "https://ngocanh122003.github.io",
  brand: "DVNA",
  teacherName: "Thầy Ngọc Ánh",
  fullName: "Đoàn Vũ Ngọc Ánh",
  description:
    "Thầy Đoàn Vũ Ngọc Ánh – dạy Khoa học tự nhiên 7–9 và Vật lý 10–11–12 theo chương trình GDPT 2018. Tài liệu miễn phí, học trực tiếp tại Hà Nội và online.",
  roles: ["Khoa học tự nhiên 7 – 9", "Vật lý 10 – 11 – 12", "Luyện thi tốt nghiệp THPT", "Học liệu số trực quan"],
  intro:
    "Học khoa học bằng hiểu biết chứ không học thuộc. Thầy giúp các em nắm bản chất hiện tượng, " +
    "làm chủ bài tập và tự tin bước vào mọi kỳ thi.",
  email: "dvna010203@gmail.com",
  phone: "0386 032 908",
  phoneRaw: "0386032908",
  address: "Long Biên, Hà Nội",
  socials: {
    zalo: "https://zalo.me/0386032908",
    facebook: "https://web.facebook.com/cover.grand",
    tiktok: "https://www.tiktok.com/@dvna.03",
    instagram: "https://www.instagram.com/dvna.coca/",
  },
};

export const ABOUT = {
  paragraphs: [
    "Thầy là giáo viên Khoa học tự nhiên tại Hà Nội, đồng thời là kỹ sư Công nghệ thông tin. " +
      "Thầy kết hợp hai thế mạnh này để biến những bài học khoa học khô khan thành trải nghiệm trực quan, dễ hiểu.",
    "Học liệu của thầy được biên soạn bằng LaTeX và thiết kế trên Canva — trình bày chuẩn học thuật, " +
      "rõ ràng, đẹp mắt và luôn bám sát chương trình GDPT 2018.",
  ],
  highlights: [
    { icon: "🎓", title: "Kỹ sư CNTT", text: "Đại học Xây dựng Hà Nội (HUCE)" },
    { icon: "🔬", title: "Giáo viên KHTN", text: "Giảng dạy từ 04/2025" },
    { icon: "📐", title: "Học liệu chuẩn", text: "Soạn bằng LaTeX & Canva" },
    { icon: "💻", title: "EdTech", text: "Ứng dụng công nghệ vào dạy học" },
  ],
};

// Dự phòng — cùng cấu trúc với GET /api/courses
// color: sky | coral | mint | brand | sun (khai báo trong globals.css)
export const COURSES = [
  {
    id: 1,
    title: "Khoa học tự nhiên 7 – 9",
    level: "THCS",
    icon: "🌱",
    color: "mint",
    description: "Xây nền vững cả Lý – Hoá – Sinh qua thí nghiệm, hình ảnh trực quan và ví dụ đời sống.",
    topics: ["Chất và sự biến đổi của chất", "Vật sống", "Năng lượng và sự biến đổi", "Trái Đất và bầu trời"],
  },
  {
    id: 2,
    title: "Vật lý 10 – 11 – 12",
    level: "THPT",
    icon: "⚛️",
    color: "brand",
    description: "Nắm chắc kiến thức SGK mới, hiểu bản chất và giải nhanh các dạng bài trọng tâm.",
    topics: [
      "Lớp 10: Động học, động lực học, năng lượng, động lượng",
      "Lớp 11: Dao động, sóng, điện trường, dòng điện",
      "Lớp 12: Vật lí nhiệt, khí lí tưởng, từ trường, hạt nhân",
    ],
  },
  {
    id: 3,
    title: "Luyện đề tốt nghiệp THPT",
    level: "Luyện thi",
    icon: "🎯",
    color: "coral",
    description: "Luyện đủ 3 dạng câu hỏi theo cấu trúc đề thi mới, rèn tốc độ và sự chính xác.",
    topics: ["Trắc nghiệm nhiều lựa chọn", "Trắc nghiệm Đúng / Sai", "Câu trả lời ngắn", "Đề thi thử có chữa chi tiết"],
  },
];

// Dự phòng — cùng cấu trúc với GET /api/documents. Link được nạp từ máy chủ.
const khtn = (key, label) => ({
  key,
  label,
  items: [
    { subject: "Vật lý", icon: "🚀", color: "sky", link: null },
    { subject: "Hoá học", icon: "🧪", color: "coral", link: null },
    { subject: "Sinh học", icon: "🧬", color: "mint", link: null },
  ],
});
const physics = (key, label, exam) => ({
  key,
  label,
  items: [
    { subject: "Lý thuyết", icon: "📘", color: "brand", link: null },
    { subject: "Bài tập", icon: "✏️", color: "sky", link: null },
    { subject: exam, icon: "📝", color: "coral", link: null },
  ],
});

export const DOCUMENT_GROUPS = [
  khtn("khtn7", "KHTN 7"),
  khtn("khtn8", "KHTN 8"),
  khtn("khtn9", "KHTN 9"),
  physics("vl10", "Vật lý 10", "Đề kiểm tra"),
  physics("vl11", "Vật lý 11", "Đề kiểm tra"),
  physics("vl12", "Vật lý 12", "Đề thi thử"),
];

export const NAV = [
  { href: "/#gioi-thieu", label: "Giới thiệu" },
  { href: "/#khoa-hoc", label: "Khoá học" },
  { href: "/#tai-lieu", label: "Tài liệu" },
  { href: "/#lien-he", label: "Liên hệ" },
];
