import { createFileRoute } from "@tanstack/react-router";
import { ContentRoute, contentHead } from "@/lib/content-route";
export const Route = createFileRoute("/hoat-dong/ma-so-ma-vach")({
  component: () => <ContentRoute path="/hoat-dong/ma-so-ma-vach" />,
  head: () => contentHead("/hoat-dong/ma-so-ma-vach"),
});
