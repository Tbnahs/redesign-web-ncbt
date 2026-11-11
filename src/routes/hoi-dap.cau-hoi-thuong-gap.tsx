import { createFileRoute } from "@tanstack/react-router";
import { FaqPage } from "@/pages/FaqPage";
import { siteHead } from "@/lib/site-meta";
export const Route = createFileRoute("/hoi-dap/cau-hoi-thuong-gap")({
  component: FaqPage,
  head: () =>
    siteHead({
      title: "Câu hỏi thường gặp | Trung tâm Mã số, Mã vạch Quốc gia",
      description:
        "Câu trả lời cho các thắc mắc thường gặp về mã số mã vạch, truy xuất nguồn gốc và hoạt động của Trung tâm.",
    }),
});
