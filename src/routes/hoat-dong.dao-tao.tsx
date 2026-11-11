import { createFileRoute } from "@tanstack/react-router";
import { ContentRoute, contentHead } from "@/lib/content-route";
export const Route = createFileRoute("/hoat-dong/dao-tao")({
  component: () => <ContentRoute path="/hoat-dong/dao-tao" />,
  head: () => contentHead("/hoat-dong/dao-tao"),
});
