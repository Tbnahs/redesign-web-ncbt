import { useState } from 'react';
import { Menu } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { SharesCounter } from '@/components/common/SharesCounter';
import { AuthLinks } from '@/components/header/AuthLinks';
import { LanguageSwitcher } from '@/components/header/LanguageSwitcher';
import { SearchField } from '@/components/header/SearchField';
import { WeatherWidget } from '@/components/header/WeatherWidget';
import { brand } from '@/config/brand';

interface TopBarProps {
  menuOpen: boolean;
  onOpenMenu: () => void;
}

export function TopBar({ menuOpen, onOpenMenu }: TopBarProps) {
  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <BrandLogo compact />

        <div className="hidden flex-1 items-center justify-center gap-4 2xl:flex">
          <AuthLinks />
          <SearchField className="max-w-[200px]" />
          <FollowNotice />
          <WeatherWidget />
        </div>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <SharesCounter className="hidden 2xl:flex" />
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <span
            className="hidden items-center justify-center rounded border-2 border-navy-900 px-2 py-0.5 text-xs font-bold tracking-wide text-navy-900 sm:flex"
            aria-label="GS1"
          >
            {brand.gs1Badge}
          </span>

          <button
            type="button"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            onClick={onOpenMenu}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-navy-900 text-white transition-colors duration-200 hover:bg-navy-700"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FollowNotice() {
  const [message, setMessage] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMessage(true)}
        className="whitespace-nowrap rounded-md bg-primary-500 px-5 py-2 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-primary-600"
      >
        THEO DÕI
      </button>
      {message && (
        <span role="status" className="max-w-40 whitespace-normal text-xs text-neutral-600">
          Theo dõi chưa được kết nối
        </span>
      )}
    </>
  );
}
