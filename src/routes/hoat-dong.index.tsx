import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/hoat-dong/")({
  beforeLoad: () => { throw redirect({ to: "/hoat-dong/ma-so-ma-vach" }); },
});