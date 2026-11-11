import { createFileRoute } from "@tanstack/react-router";
import { ContentRoute, contentHead } from "@/lib/content-route";
export const Route = createFileRoute("/gioi-thieu/co-cau-to-chuc")({
  component: () => <ContentRoute path="/gioi-thieu/co-cau-to-chuc" />,
  head: () => contentHead("/gioi-thieu/co-cau-to-chuc"),
});
