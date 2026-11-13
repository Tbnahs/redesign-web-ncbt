import { Link } from "@tanstack/react-router";
import { FacebookLogo, XLogo, YouTubeLogo } from "@/components/icons/SocialIcons";
import type { ReactNode } from "react";
import type { NewsArticle } from "@/types/content";
import { usePublicArticles } from "@/data/demo-admin-store";
import { useDemoMediaUrl } from "@/lib/demo-media";
import { useLocale } from "@/i18n";
export const sourceCategories = [
  { slug: "tin-tuc-su-kien", title: "Tin tức / Sự kiện", en: "News / Events" },
  { slug: "ma-so-ma-vach", title: "Mã số mã vạch", en: "Barcodes" },
  {
    slug: "hoat-dong-tai-dia-phuong",
    title: "Hoạt động MSMV tại địa phương",
    en: "Local GS1 activities",
  },
  { slug: "truy-xuat-nguon-goc", title: "Truy xuất nguồn gốc", en: "Traceability" },
  { slug: "ma-lei", title: "Mã LEI", en: "LEI" },
];
export function sourceDate(date: string) {
  return date.split("-").reverse().join("-");
}
export function ArticleLink({
  article,
  children,
  className = "",
}: {
  article: NewsArticle;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Link to="/tin-tuc/$slug" params={{ slug: article.slug }} className={className}>
      {children ?? article.title}
    </Link>
  );
}
export function SourcePhoto({ article }: { article: NewsArticle }) {
  const imageUrl = useDemoMediaUrl(article.thumbnail);
  return (
    <span className="source-photo">
      <img
        src={imageUrl}
        alt={article.title}
        loading="lazy"
        onError={(e) => {
          const t = e.currentTarget;
          if (!t.src.endsWith("news-placeholder.svg")) {
            t.src = "/images/news-placeholder.svg";
            t.alt = "Ảnh minh họa";
            t.parentElement?.classList.add("source-image-missing");
          }
        }}
      />
    </span>
  );
}
export function SourceBreadcrumbs({ title }: { title: string }) {
  const { locale } = useLocale();
  return (
    <div className="source-breadcrumb">
      <Link to="/">{locale === "vi" ? "Trang chủ" : "Home"}</Link>
      <span>›</span>
      <span>{title}</span>
    </div>
  );
}
export function SourceHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="source-section-title">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
export function SourceSidebar() {
  const articles = usePublicArticles();
  const { locale } = useLocale();
  return (
    <aside className="source-sidebar">
      <h3>{locale === "vi" ? "Kết nối với chúng tôi" : "Connect with us"}</h3>
      <div className="source-social">
        <a className="source-social-link source-social-link--facebook" href="https://www.facebook.com/GS1Vietnam" target="_blank" rel="noreferrer" aria-label="Facebook">
          <FacebookLogo className="source-brand-logo" />
          f
        </a>
        <a className="source-social-link source-social-link--x" href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
          <XLogo className="source-brand-logo" />
        </a>
        <a className="source-social-link source-social-link--youtube" href="https://www.youtube.com/channel/UCEHxZm8ljXO-St5-z0em3BA/featured" target="_blank" rel="noreferrer" aria-label="YouTube">
          <YouTubeLogo className="source-youtube-logo" />
          ▶
        </a>
        <a href="mailto:msmv@nbc.gov.vn">✉</a>
      </div>
      <h3>{locale === "vi" ? "Tin mới nhất" : "Latest news"}</h3>
      {articles
        .slice()
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5)
        .map((a) => (
          <article className="source-side-story" key={a.slug}>
            <ArticleLink article={a}>
              <SourcePhoto article={a} />
            </ArticleLink>
            <div>
              <ArticleLink article={a} />
              <time>{sourceDate(a.date)}</time>
            </div>
          </article>
        ))}
      <h3>{locale === "vi" ? "Chuyên mục" : "Categories"}</h3>
      {sourceCategories.map((c) => (
        <Link
          className="source-category-link"
          key={c.slug}
          to="/tin-tuc/$slug"
          params={{ slug: c.slug }}
        >
          {locale === "vi" ? c.title : c.en} <span>›</span>
        </Link>
      ))}
      <div className="source-support">
        <h3>{locale === "vi" ? "Hỗ trợ trực tuyến" : "Contact support"}</h3>
        <a href="tel:1900636218">☎ 1900 636218</a>
        <a href="mailto:msmv@nbc.gov.vn">msmv@nbc.gov.vn</a>
      </div>
    </aside>
  );
}
