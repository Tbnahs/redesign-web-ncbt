import { Route } from "@/routes/tim-kiem";
import { NewsListPage } from "./NewsListPage";
import { useLocale } from "@/i18n";
export function SearchPage() {
  const { q } = Route.useSearch();
  const { locale } = useLocale();
  return (
    <NewsListPage
      title={locale === "vi" ? "Kết quả tìm kiếm" : "Search results"}
      initialQuery={q ?? ""}
    />
  );
}
