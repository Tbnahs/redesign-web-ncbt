import assets from "@/data/source-assets.json";
const missing = new Set(assets.filter((a) => !a.success).map((a) => a.localUrl));
const staticRoutes: Record<string, string> = {
  "gioi-thieu-chung": "/gioi-thieu/lich-su-hinh-thanh",
  "so-do-to-chuc": "/gioi-thieu/co-cau-to-chuc",
  "cau-hoi-thuong-gap": "/hoi-dap/cau-hoi-thuong-gap",
  "danh-sach-cau-hoi": "/hoi-dap/danh-sach-cau-hoi",
  "tao-cau-hoi": "/hoi-dap/tao-cau-hoi",
  "lien-he": "/lien-he",
};
export function sourceHtml(html: string) {
  return html
    .replace(/(?:https?:\/\/nbc\.gov\.vn)?\/?tintuc\/([^"'\s<>]+)/g, "/tin-tuc/$1")
    .replace(
      /(?:https?:\/\/nbc\.gov\.vn)?\/?category\/([^"'\s<>]+)/g,
      (_all, slug: string) => staticRoutes[slug.replace(/\/$/, "")] ?? `/tin-tuc/${slug}`,
    )
    .replace(/<img\b[^>]*>/g, (tag) => {
      const path = /src="([^"]+)"/.exec(tag)?.[1];
      return path && missing.has(path)
        ? '<figure class="source-missing-figure"><img src="/images/news-placeholder.svg" alt="Ảnh minh họa thay cho ảnh nguồn không còn truy cập được" loading="lazy"><figcaption>Ảnh minh họa — ảnh gốc hiện không còn truy cập được.</figcaption></figure>'
        : tag;
    });
}
