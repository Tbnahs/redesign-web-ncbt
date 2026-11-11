import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { siteHead } from "@/lib/site-meta";
export const Route = createFileRoute("/tin-tuc")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] as string : undefined,
  }),
  component: () => <Outlet />,
  head: () => siteHead({
    title: "Tin tức | Trung tâm Mã số, Mã vạch Quốc gia",
    description: "Tin tức, sự kiện và thông báo mới nhất từ Trung tâm Mã số, Mã vạch Quốc gia.",
  }),
});
