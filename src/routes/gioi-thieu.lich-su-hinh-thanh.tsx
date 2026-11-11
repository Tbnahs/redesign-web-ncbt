import { createFileRoute } from "@tanstack/react-router";
import { ContentRoute, contentHead } from "@/lib/content-route";
export const Route = createFileRoute("/gioi-thieu/lich-su-hinh-thanh")({ component: () => <ContentRoute path="/gioi-thieu/lich-su-hinh-thanh" />, head: () => contentHead("/gioi-thieu/lich-su-hinh-thanh") });
