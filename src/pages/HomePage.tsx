import { SourceLatest, SourceCounters } from "@/components/reference/SourceMotion";
import { Link } from "@tanstack/react-router";
import home from "@/data/source-home.json";
import { usePublicArticles } from "@/data/demo-admin-store";
import {
  ArticleLink,
  SourcePhoto,
  SourceHeading,
  sourceCategories,
  sourceDate,
} from "@/components/reference/SourceNews";
import { useLocale } from "@/i18n";
export function HomePage() {
  const { locale } = useLocale();
  const vi = locale === "vi";
  const articles = usePublicArticles();
  const featured = articles
    .filter((a) => a.featured)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id))
    .slice(0, 5);
  const lead = featured[0];
  return (
    <>
      <section className="source-hero" aria-label="Giới thiệu Trung tâm">
        <img
          src={home.heroImages[0]}
          alt="Trung tâm Mã số Mã vạch Quốc gia – Mã số mã vạch, truy xuất nguồn gốc và chuyển đổi số"
          fetchPriority="high"
        />
      </section>
      <div className="source-container">
        <section className="source-featured">
          {lead && (
            <ArticleLink article={lead} className="source-cover">
              <SourcePhoto article={lead} />
              <div className="source-cover-copy">
                <span>{vi ? "Tin tức / Sự kiện" : "News / Events"}</span>
                <h1>{lead.title}</h1>
              </div>
            </ArticleLink>
          )}
          <div className="source-featured-list">
            {featured.slice(1, 5).map((a) => (
              <article key={a.slug} className="source-featured-row">
                <ArticleLink article={a}>
                  <SourcePhoto article={a} />
                </ArticleLink>
                <ArticleLink article={a} />
              </article>
            ))}
          </div>
        </section>
        <SourceLatest />
      </div>
      <SourceCounters />
      <div className="source-container source-home-sections">
        {sourceCategories.map((c) => {
          const section = home.sections.find((s) => s.category === c.slug);
          const items = articles
            .filter((a) => a.category === c.slug || a.categories?.includes(c.slug))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .slice(0, 6);
          const first = items[0];
          return (
            <section key={c.slug}>
              <SourceHeading title={vi ? c.title : c.en}>
                <Link to="/tin-tuc/$slug" params={{ slug: c.slug }}>
                  {vi ? "Xem tất cả" : "View all"} ›
                </Link>
              </SourceHeading>
              {first && (
                <div className="source-category-grid">
                  <article className="source-category-lead">
                    <ArticleLink article={first}>
                      <SourcePhoto article={first} />
                    </ArticleLink>
                    <h3>
                      <ArticleLink article={first} />
                    </h3>
                    <time>{sourceDate(first.date)}</time>
                    <p>{first.summary}</p>
                  </article>
                  <div>
                    {items.slice(1, 6).map((a) => (
                      <article key={a.slug} className="source-category-row">
                        <ArticleLink article={a}>
                          <SourcePhoto article={a} />
                        </ArticleLink>
                        <div>
                          <h3>
                            <ArticleLink article={a} />
                          </h3>
                          <time>{sourceDate(a.date)}</time>
                          <p>{a.summary}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
