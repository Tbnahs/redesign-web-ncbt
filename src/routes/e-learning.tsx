import { createFileRoute } from "@tanstack/react-router";
import { ElearningPage } from "@/pages/ElearningPage";
import { siteHead } from "@/lib/site-meta";
export const Route = createFileRoute("/e-learning")({ component: ElearningPage, head: () => siteHead({ title: "E-learning | Trung tâm Mã số, Mã vạch Quốc gia", description: "Các khóa đào tạo trực tuyến và chương trình đào tạo về mã số mã vạch." }) });
