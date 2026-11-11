import { useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { NavItem } from "@/config/navigation";

interface SideMenuProps {
  title: string;
  items: NavItem[];
}

export function SideMenu({ title, items }: SideMenuProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <nav aria-label={title} className="space-y-4">
      <h2 className="border-l-4 border-primary-500 pl-3 text-lg font-bold text-navy-900">
        {title}
      </h2>
      <ul className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {items.map((item) => (
          <li key={item.path} className="border-b border-neutral-200 last:border-b-0">
            <a
              href={item.path}
              className={`flex items-center justify-between gap-3 px-5 py-3.5 text-sm transition-colors duration-200 ${
                pathname === item.path
                  ? "bg-primary-500 font-bold text-white"
                  : "text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
              }`}
            >
              {item.label}
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
