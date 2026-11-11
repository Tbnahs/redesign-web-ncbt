import { createFileRoute } from "@tanstack/react-router";
import { ContentRoute, contentHead } from "@/lib/content-route";
export const Route = createFileRoute("/hoat-dong/ma-lei")({
  component: () => <ContentRoute path="/hoat-dong/ma-lei" />,
  head: () => contentHead("/hoat-dong/ma-lei"),
});
