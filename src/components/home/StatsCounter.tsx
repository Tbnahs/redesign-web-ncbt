import type { LucideIcon } from "lucide-react";
import { Building2, Leaf, Package, QrCode } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import stats from "@/data/stats.json";
import type { StatItem } from "@/types/content";

const statItems: StatItem[] = stats;

const statIcons: Record<string, LucideIcon> = {
  building: Building2,
  package: Package,
  leaf: Leaf,
  scan: QrCode,
};

function StatCard({ item }: { item: StatItem }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const count = useCountUp(item.value, inView);
  const Icon = statIcons[item.icon] ?? QrCode;

  return (
    <div
      ref={ref}
      className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <p
        className="text-3xl font-bold tabular-nums text-primary-500 sm:text-4xl"
        aria-live="polite"
      >
        {count.toLocaleString("vi-VN")}
      </p>
      <p className="text-sm leading-relaxed text-neutral-600">{item.label}</p>
    </div>
  );
}

export function StatsCounter() {
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">Con số ấn tượng</h2>
          <p className="mt-3 text-neutral-600">
            Những con số tiêu biểu về hoạt động mã số mã vạch trên cả nước.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item) => (
            <StatCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
