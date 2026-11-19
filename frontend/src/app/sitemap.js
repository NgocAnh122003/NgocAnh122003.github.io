import { SITE } from "@/data/site";

export const dynamic = "force-static";

// sitemap.xml — giúp Google tìm thấy các trang của website
export default function sitemap() {
  return [
    { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/chinh-sach-bao-mat/`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
