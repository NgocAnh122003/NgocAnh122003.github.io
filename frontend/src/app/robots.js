import { SITE } from "@/data/site";

export const dynamic = "force-static";

// robots.txt — cho Google đọc trang công khai, chặn trang quản trị
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
