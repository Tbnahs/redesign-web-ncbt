import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { siteHead } from "@/lib/site-meta";

export const Route = createFileRoute("/tin-tuc")({
  validateSearch: (search: Record<string, unknown>) =>
    typeof search["q"] === "string" ? { q: search["q"] } : {},
  component: () => <Outlet />,
  head: () =>
    siteHead({
      title: "Tin tức | Trung tâm Mã số, Mã vạch Quốc gia",
      description: "Tin tức, sự kiện và thông báo mới nhất từ Trung tâm Mã số, Mã vạch Quốc gia.",
    }),
});
