import { useEffect } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { X } from 'lucide-react';
import { SharesCounter } from '@/components/common/SharesCounter';
import { AuthLinks } from '@/components/header/AuthLinks';
import { SearchField } from '@/components/header/SearchField';
import { mainNav } from '@/config/navigation';

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MegaMenu({ open, onClose }: MegaMenuProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 animate-fade-in">
      <div className="absolute inset-0 bg-navy-900/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative mx-auto mt-6 flex max-h-[calc(100vh-3rem)] w-[calc(100%-2rem)] max-w-6xl flex-col overflow-y-auto rounded-xl bg-white p-6 shadow-2xl animate-slide-down sm:mt-12 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng menu"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-md text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-navy-900"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="mb-6 flex flex-col gap-4 pr-12 xl:hidden">
          <SearchField />
          <AuthLinks />
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-6">
          {mainNav.filter((item) => !item.megaMenuHidden).map((item) => (
            <section key={item.path} className="space-y-3">
              <Link
                to={item.path}
                activeOptions={{ exact: item.path === '/' }}
                onClick={onClose}
                className="block border-b-2 border-primary-100 pb-2 text-sm font-bold uppercase tracking-wide text-primary-700 transition-colors duration-200 hover:border-primary-500 hover:text-primary-500"
              >
                {item.label}
              </Link>
              {item.children && (
                <ul className="space-y-2">
                  {item.children.map((child) => (
                    <li key={child.path}>
                      <Link
                        to={child.path}
                        onClick={onClose}
                        className={`block text-sm leading-snug transition-colors duration-200 ${
                            pathname === child.path
                              ? 'font-medium text-primary-600'
                              : 'text-neutral-600 hover:text-primary-600'
                          }`}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-600">Chưa có liên kết mạng xã hội trong thông tin được cung cấp.</p>
          <SharesCounter />
        </div>
      </div>
    </div>
  );
}
