import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/hoi-dap/")({
  beforeLoad: () => {
    throw redirect({ to: "/hoi-dap/cau-hoi-thuong-gap" });
  },
});
