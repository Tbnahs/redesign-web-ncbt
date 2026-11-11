import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/tra-cuu")({ beforeLoad: () => { throw redirect({ to: "/hoat-dong/truy-xuat-nguon-goc" }); } });
