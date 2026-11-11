import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";
import { homeHead } from "@/lib/site-meta";

export const Route = createFileRoute("/")({
  head: () => homeHead(),
  component: Index,
});

function Index() {
  return <HomePage />;
}
