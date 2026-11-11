import { createFileRoute } from "@tanstack/react-router";
import { NewsDetailPage } from "@/pages/NewsDetailPage";
import { getArticleBySlug } from "@/data/newsRepository";
import { getCategoryLabel, newsCategories } from "@/config/navigation";
import { NewsListPage } from "@/pages/NewsListPage";
import { siteHead } from "@/lib/site-meta";
import { Route as NewsRoute } from "@/routes/tin-tuc";
export const Route = createFileRoute("/tin-tuc/$slug")({
  validateSearch: NewsRoute.options.validateSearch,
  component: ArticleOrCategory,
  head: ({ params }) => {
    const category = newsCategories.find((item) => item.slug === params.slug);
    const article = getArticleBySlug(params.slug);
    return siteHead({
      title: article
        ? `${article.title} | Trung tâm Mã số, Mã vạch Quốc gia`
        : `${getCategoryLabel(params.slug)} | Tin tức`,
      description:
        article?.summary ??
        `Tin tức chuyên mục ${getCategoryLabel(params.slug)} từ Trung tâm Mã số, Mã vạch Quốc gia.`,
      ...(article?.thumbnail.startsWith("https://") ? { image: article.thumbnail } : {}),
    });
  },
});
function ArticleOrCategory() {
  const { slug } = Route.useParams();
  if (newsCategories.some((item) => item.slug === slug))
    return <NewsListPage title={getCategoryLabel(slug)} fixedCategory={slug} />;
  return <NewsDetailPage slug={slug} />;
}
