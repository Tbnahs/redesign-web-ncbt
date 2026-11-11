import { createFileRoute } from "@tanstack/react-router";
import { ContentRoute, contentHead } from "@/lib/content-route";
export const Route = createFileRoute("/gioi-thieu/chuc-nang-nhiem-vu")({
  component: () => <ContentRoute path="/gioi-thieu/chuc-nang-nhiem-vu" />,
  head: () => contentHead("/gioi-thieu/chuc-nang-nhiem-vu"),
});
