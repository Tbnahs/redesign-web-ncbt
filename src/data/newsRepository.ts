import home from "./source-home.json";
import { seedArticles, getPublicArticles } from "./demo-admin-store";
export const allArticles = seedArticles;
export const featuredArticle =
  allArticles.find((a) => a.slug === home.featuredSlugs[0]) ?? allArticles[0]!;
export function getArticleBySlug(slug: string) {
  return getPublicArticles().find((a) => a.slug === decodeURIComponent(slug).replace(/\/$/, ""));
}
export function getArticlesByCategory(category: string) {
  const key = category === "hoat-dong-msmv-dia-phuong" ? "hoat-dong-tai-dia-phuong" : category;
  return getPublicArticles().filter((a) => a.category === key || a.categories?.includes(key));
}
export function getRecentArticles(limit = 5) {
  return getPublicArticles()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}
export function getRelatedArticles(slug: string, limit = 4) {
  const a = getArticleBySlug(slug);
  return getPublicArticles()
    .filter((n) => n.slug !== slug && n.category === a?.category)
    .slice(0, limit);
}
