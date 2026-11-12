import { allArticles } from "@/data/newsRepository";
interface SearchEntry {
  id: string;
  title: string;
  detail: string;
  href: string;
  slug?: string;
}
export interface SiteSearchGroup {
  key: "news" | "questions" | "courses";
  title: string;
  href: string;
  results: SiteSearchResult[];
}
export interface SiteSearchResult extends SearchEntry {}
export function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d");
}
export function searchSite(query: string): SiteSearchGroup[] {
  const needle = normalizeSearchText(query.trim());
  if (!needle) return [];
  return [
    {
      key: "news",
      title: "Tin tức",
      href: "/tin-tuc",
      results: allArticles
        .filter((a) => normalizeSearchText(a.title).includes(needle))
        .map((a) => ({
          id: a.id,
          title: a.title,
          detail: a.summary,
          href: `/tin-tuc/${a.slug}`,
          slug: a.slug,
        })),
    },
  ];
}
