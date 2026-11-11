import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/truy-xuat-nguon-goc/tra-cuu-san-pham")({ beforeLoad: () => { throw redirect({ to: "/hoat-dong/truy-xuat-nguon-goc" }); } });
