import { createFileRoute } from "@tanstack/react-router";
import { ContentRoute, contentHead } from "@/lib/content-route";
export const Route = createFileRoute("/gioi-thieu/doi-tac-quoc-te")({
  component: () => <ContentRoute path="/gioi-thieu/doi-tac-quoc-te" />,
  head: () => contentHead("/gioi-thieu/doi-tac-quoc-te"),
});
