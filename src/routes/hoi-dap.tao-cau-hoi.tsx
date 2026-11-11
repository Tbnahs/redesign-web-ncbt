import { createFileRoute } from "@tanstack/react-router";
import { CreateQuestionPage } from "@/pages/CreateQuestionPage";
import { siteHead } from "@/lib/site-meta";
export const Route = createFileRoute("/hoi-dap/tao-cau-hoi")({
  component: CreateQuestionPage,
  head: () =>
    siteHead({
      title: "Tạo câu hỏi | Trung tâm Mã số, Mã vạch Quốc gia",
      description: "Gửi câu hỏi về mã số, mã vạch và các hoạt động của Trung tâm.",
    }),
});
