import { createFileRoute } from "@tanstack/react-router";
import { ContentRoute, contentHead } from "@/lib/content-route";
export const Route = createFileRoute("/hoat-dong/truy-xuat-nguon-goc")({ component: () => <ContentRoute path="/hoat-dong/truy-xuat-nguon-goc" />, head: () => contentHead("/hoat-dong/truy-xuat-nguon-goc") });
