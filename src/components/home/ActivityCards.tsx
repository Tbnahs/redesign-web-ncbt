import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Barcode, Fingerprint, GraduationCap, Leaf, Stethoscope } from 'lucide-react';
import { SectionHeading } from '@/components/common/SectionHeading';
import activities from '@/data/activities.json';
import type { ActivityItem } from '@/types/content';

const activityItems: ActivityItem[] = activities;

const activityIcons: Record<string, LucideIcon> = {
  barcode: Barcode,
  leaf: Leaf,
  fingerprint: Fingerprint,
  stethoscope: Stethoscope,
  graduation: GraduationCap,
};

export function ActivityCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title="Hoạt động" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {activityItems.map((item) => {
          const Icon = activityIcons[item.icon] ?? Barcode;
          return (
            <a
              key={item.id}
              href={item.path}
              className="group flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-500 transition-colors duration-300 group-hover:bg-primary-500 group-hover:text-white">
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-bold text-navy-900 transition-colors duration-200 group-hover:text-primary-600">
                {item.title}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-neutral-600">{item.description}</p>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-primary-500">
                Xem chi tiết
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
