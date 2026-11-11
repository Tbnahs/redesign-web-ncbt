import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/gioi-thieu/")({
  beforeLoad: () => { throw redirect({ to: "/gioi-thieu/lich-su-hinh-thanh" }); },
});