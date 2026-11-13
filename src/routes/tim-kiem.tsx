import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "@/pages/SearchPage";
import { validateSiteSearchParams } from "@/lib/demo-validation";
import { siteHead } from "@/lib/site-meta";

export const Route = createFileRoute("/tim-kiem")({
  validateSearch: (search: Record<string, unknown>) => validateSiteSearchParams(search),
  component: SearchPage,
  head: () =>
    siteHead({
      title: "Tìm kiếm | Trung tâm Mã số Mã vạch Truy xuất nguồn gốc quốc gia",
      description: "Tìm kiếm tin tức, câu hỏi và khóa học E-learning trong hệ thống.",
    }),
});
