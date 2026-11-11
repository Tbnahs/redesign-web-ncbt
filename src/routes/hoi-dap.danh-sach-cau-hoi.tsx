import { createFileRoute } from "@tanstack/react-router";
import { QuestionListPage } from "@/pages/QuestionListPage";
import { siteHead } from "@/lib/site-meta";
export const Route = createFileRoute("/hoi-dap/danh-sach-cau-hoi")({ component: QuestionListPage, head: () => siteHead({ title: "Danh sách câu hỏi | Trung tâm Mã số, Mã vạch Quốc gia", description: "Tra cứu các câu hỏi và câu trả lời về mã số mã vạch và hoạt động của Trung tâm." }) });
