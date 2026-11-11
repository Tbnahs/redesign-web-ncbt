import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { SideMenu } from '@/components/common/SideMenu';
import { SupportCard } from '@/components/common/SupportCard';
import { findParentNavItem } from '@/config/navigation';

interface SectionLayoutProps {
  path: string;
  title: string;
  children: ReactNode;
}

export function SectionLayout({ path, title, children }: SectionLayoutProps) {
  const parent = findParentNavItem(path);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Trang chủ', to: '/' },
          ...(parent ? [{ label: parent.label, to: parent.path }] : []),
          { label: title },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">{children}</div>
        <aside className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            {parent && <SideMenu title={parent.label} items={parent.children ?? []} />}
            <SupportCard />
          </div>
        </aside>
      </div>
    </section>
  );
}
