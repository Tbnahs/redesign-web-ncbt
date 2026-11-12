import { createFileRoute } from "@tanstack/react-router";
import { AdminApp, type AdminView } from "@/components/admin/AdminApp";
const views: AdminView[] = [
  "dashboard",
  "posts",
  "editor",
  "comments",
  "contacts",
  "profile",
  "training",
];
export const Route = createFileRoute("/admin")({
  validateSearch: (s: Record<string, unknown>) => ({
    view: views.includes(s["view"] as AdminView)
      ? (s["view"] as AdminView)
      : ("dashboard" as AdminView),
    id: typeof s["id"] === "string" ? s["id"] : "",
    q: typeof s["q"] === "string" ? s["q"] : "",
  }),
  component: AdminRoute,
  head: () => ({
    meta: [{ title: "NCBT | Quản trị nội dung" }, { name: "robots", content: "noindex,nofollow" }],
  }),
});
function AdminRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <AdminApp
      {...search}
      onNavigate={(view, id = "", q = "") => void navigate({ search: { view, id, q } })}
    />
  );
}
