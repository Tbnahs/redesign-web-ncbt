import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { mainNav } from "@/config/navigation";

type RoutePaths<T> = T extends readonly (infer Item)[]
  ? Item extends { path: infer Path extends string; children?: infer Children }
    ? Path | RoutePaths<Children>
    : never
  : never;
type BreadcrumbPath = RoutePaths<typeof mainNav> | "/tin-tuc/$slug" | "/";

export interface BreadcrumbItem {
  label: string;
  to?: BreadcrumbPath;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Đường dẫn"
      className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
          {item.to ? (
            <Link to={item.to} className="hover:text-primary-600">
              {item.label}
            </Link>
          ) : (
            <span className="line-clamp-1 text-navy-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
