/** @type {import('next').NextConfig} */
const nextConfig = {
  // Xuất ra web tĩnh (thư mục "out") để đăng lên GitHub Pages
  output: "export",
  // /admin/khoa-hoc → /admin/khoa-hoc/index.html (GitHub Pages phục vụ chắc chắn)
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
