import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/footer/SiteFooter';
import { SiteHeader } from '@/components/header/SiteHeader';

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
