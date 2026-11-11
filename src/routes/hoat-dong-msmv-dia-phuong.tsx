import { createFileRoute } from "@tanstack/react-router";
import { NewsListPage } from "@/pages/NewsListPage";
import { siteHead } from "@/lib/site-meta";
export const Route = createFileRoute("/hoat-dong-msmv-dia-phuong")({ component: () => <NewsListPage title="Hoạt động MSMV tại địa phương" fixedCategory="hoat-dong-msmv-dia-phuong" />, head: () => siteHead({ title: "Hoạt động MSMV tại địa phương | Trung tâm Mã số, Mã vạch Quốc gia", description: "Tin tức hoạt động mã số, mã vạch tại các địa phương." }) });
