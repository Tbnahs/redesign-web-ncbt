import { useEffect, useMemo, useState } from "react";
import { usePublicArticles } from "@/data/demo-admin-store";
import {
  ArticleLink,
  SourcePhoto,
  SourceBreadcrumbs,
  SourceSidebar,
  sourceDate,
} from "@/components/reference/SourceNews";
import { useLocale } from "@/i18n";
export function NewsListPage({
  title = "Tin tức",
  fixedCategory,
  initialQuery = "",
}: {
  title?: string;
  fixedCategory?: string;
  initialQuery?: string | undefined;
}) {
  const { locale } = useLocale();
  const vi = locale === "vi";
  const articles = usePublicArticles();
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [fixedCategory, initialQuery, articles]);
  const items = useMemo(() => {
    const key =
      fixedCategory === "hoat-dong-msmv-dia-phuong" ? "hoat-dong-tai-dia-phuong" : fixedCategory;
    const data = key
      ? articles.filter((a) => a.category === key || a.categories?.includes(key))
      : articles;
    const norm = (s: string) =>
      s
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/đ/g, "d")
        .toLowerCase();
    return data
      .filter((a) => norm(a.title).includes(norm(initialQuery)))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [fixedCategory, initialQuery, articles]);
  const pages = Math.ceil(items.length / 10);
  const current = Math.min(page, pages || 1);
  return (
    <div className="source-container">
      <SourceBreadcrumbs title={title} />
      <div className="source-page-grid">
        <section>
          <h1 className="source-page-title">{title}</h1>
          {initialQuery && (
            <p className="source-result-count">
              {items.length} {vi ? "bài viết phù hợp với" : "articles matching"} “{initialQuery}”
            </p>
          )}
          <div className="source-list-grid">
            {items.slice((current - 1) * 10, current * 10).map((a) => (
              <article key={a.slug}>
                <ArticleLink article={a}>
                  <SourcePhoto article={a} />
                </ArticleLink>
                <time>{sourceDate(a.date)}</time>
                <h2>
                  <ArticleLink article={a} />
                </h2>
                <p>{a.summary}</p>
              </article>
            ))}
          </div>
          {!items.length && (
            <p className="source-empty">
              {vi ? "Chưa có bài viết trong chuyên mục này." : "No articles found."}
            </p>
          )}
          {pages > 1 && (
            <nav className="source-pagination" aria-label="Phân trang">
              <button
                disabled={current === 1}
                onClick={() => {
                  setPage(current - 1);
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              >
                ‹
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === pages || Math.abs(n - current) < 3)
                .map((n, i, arr) => (
                  <span key={n}>
                    {i > 0 && n - arr[i - 1]! > 1 && <span>…</span>}
                    <button
                      aria-current={current === n ? "page" : undefined}
                      onClick={() => {
                        setPage(n);
                        window.scrollTo({ top: 0, behavior: "instant" });
                      }}
                    >
                      {n}
                    </button>
                  </span>
                ))}
              <button
                disabled={current === pages}
                onClick={() => {
                  setPage(current + 1);
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              >
                ›
              </button>
            </nav>
          )}
        </section>
        <SourceSidebar />
      </div>
    </div>
  );
}
