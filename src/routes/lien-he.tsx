import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/pages/ContactPage";
import { siteHead } from "@/lib/site-meta";
export const Route = createFileRoute("/lien-he")({
  component: ContactPage,
  head: () =>
    siteHead({
      title: "Liên hệ | Trung tâm Mã số Mã vạch Truy xuất nguồn gốc quốc gia",
      description:
        "Thông tin liên hệ Trung tâm Mã số Mã vạch Truy xuất nguồn gốc quốc gia và gửi yêu cầu tư vấn.",
    }),
});
