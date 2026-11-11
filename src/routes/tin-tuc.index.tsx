import { createFileRoute } from "@tanstack/react-router";
import { Route as NewsRoute } from "@/routes/tin-tuc";
import { NewsListPage } from "@/pages/NewsListPage";
import { siteHead } from "@/lib/site-meta";

export const Route = createFileRoute("/tin-tuc/")({
  component: NewsIndex,
  head: () =>
    siteHead({
      title: "Tin tức | Trung tâm Mã số, Mã vạch Quốc gia",
      description: "Tin tức, sự kiện và thông báo mới nhất từ Trung tâm Mã số, Mã vạch Quốc gia.",
    }),
});

function NewsIndex() {
  const { q } = NewsRoute.useSearch();
  return <NewsListPage title="Tin tức" initialQuery={q} />;
}
