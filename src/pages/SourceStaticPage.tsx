import pages from "@/data/source-pages.json";
import { SourceBreadcrumbs, SourceSidebar } from "@/components/reference/SourceNews";
import { sourceHtml } from "@/lib/source-html";
import { translateNavLabel, useLocale } from "@/i18n";
export function SourceStaticPage({ path }: { path: string }) {
  const p = pages[path as keyof typeof pages];
  const { locale } = useLocale();
  if (!p) return null;
  return (
    <div className="source-container">
      <SourceBreadcrumbs title={translateNavLabel(p.title, locale)} />
      <div className="source-page-grid">
        <section>
          <h1 className="source-page-title">{translateNavLabel(p.title, locale)}</h1>
          {p.available ? (
            <div
              className="source-article-body"
              dangerouslySetInnerHTML={{ __html: sourceHtml(p.content) }}
            />
          ) : (
            <p className="source-empty">
              {locale === "vi"
                ? "Trang nguồn hiện chưa cung cấp nội dung sơ đồ tổ chức."
                : "The source page does not currently provide an organizational chart."}
            </p>
          )}
        </section>
        <SourceSidebar />
      </div>
    </div>
  );
}
