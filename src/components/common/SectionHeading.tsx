import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  actionLabel?: string;
  actionTo?: "/tin-tuc" | "/hoi-dap/cau-hoi-thuong-gap";
}

export function SectionHeading({ title, actionLabel, actionTo }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-4">
      <h2 className="border-l-4 border-primary-500 pl-4 text-2xl font-bold text-navy-900 sm:text-3xl">
        {title}
      </h2>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="group inline-flex items-center gap-2 text-sm font-bold text-primary-500 hover:text-primary-700"
        >
          {actionLabel}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}
