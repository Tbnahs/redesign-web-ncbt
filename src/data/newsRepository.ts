import news from '@/data/news.json';
import type { NewsArticle, NewsData } from '@/types/content';
import { mediaUrl } from '@/data/media';

const newsData: NewsData = news;

export const featuredArticle: NewsArticle = { ...newsData.featured, thumbnail: mediaUrl(newsData.featured.thumbnail) };
export const allArticles: NewsArticle[] = [...newsData.items, newsData.featured].map((article) => ({
  ...article,
  thumbnail: mediaUrl(article.thumbnail),
}));

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return allArticles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(category: string): NewsArticle[] {
  return allArticles.filter((article) => article.category === category);
}

export function getRecentArticles(limit = 5): NewsArticle[] {
  return [...allArticles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function getRelatedArticles(currentSlug: string, limit = 4): NewsArticle[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return getRecentArticles(limit);
  return allArticles
    .filter((article) => article.slug !== currentSlug)
    .sort((a, b) => {
      const aSameCategory = a.category === current.category ? 0 : 1;
      const bSameCategory = b.category === current.category ? 0 : 1;
      if (aSameCategory !== bSameCategory) return aSameCategory - bSameCategory;
      return b.date.localeCompare(a.date);
    })
    .slice(0, limit);
}
