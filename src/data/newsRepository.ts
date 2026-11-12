import source from "./source-articles.json";
import home from "./source-home.json";
import type { NewsArticle } from "@/types/content";
export const allArticles: NewsArticle[] = source;
export const featuredArticle =
  allArticles.find((a) => a.slug === home.featuredSlugs[0]) ?? allArticles[0]!;
export function getArticleBySlug(slug: string) {
  return allArticles.find((a) => a.slug === decodeURIComponent(slug).replace(/\/$/, ""));
}
export function getArticlesByCategory(category: string) {
  const key = category === "hoat-dong-msmv-dia-phuong" ? "hoat-dong-tai-dia-phuong" : category;
  return allArticles.filter((a) => a.category === key || a.categories?.includes(key));
}
export function getRecentArticles(limit = 5) {
  return [...allArticles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}
export function getRelatedArticles(slug: string, limit = 4) {
  const a = getArticleBySlug(slug);
  return allArticles.filter((n) => n.slug !== slug && n.category === a?.category).slice(0, limit);
}
