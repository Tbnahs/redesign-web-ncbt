import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/truy-xuat-nguon-goc/")({
  beforeLoad: () => {
    throw redirect({ to: "/hoat-dong/truy-xuat-nguon-goc" });
  },
});
