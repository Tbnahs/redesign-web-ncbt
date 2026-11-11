import { createFileRoute } from "@tanstack/react-router";
import { ContentRoute, contentHead } from "@/lib/content-route";
export const Route = createFileRoute("/hoat-dong/ma-udi")({ component: () => <ContentRoute path="/hoat-dong/ma-udi" />, head: () => contentHead("/hoat-dong/ma-udi") });
