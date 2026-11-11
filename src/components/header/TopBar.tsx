import { Menu } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { SharesCounter } from "@/components/common/SharesCounter";
import { AuthLinks } from "@/components/header/AuthLinks";
import { LanguageSwitcher } from "@/components/header/LanguageSwitcher";
import { SearchField } from "@/components/header/SearchField";
import { WeatherWidget } from "@/components/header/WeatherWidget";
import { NewsletterDialog } from "@/components/header/NewsletterDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { brand } from "@/config/brand";

interface TopBarProps {
  menuOpen: boolean;
  onOpenMenu: () => void;
}

export function TopBar({ menuOpen, onOpenMenu }: TopBarProps) {
  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <BrandLogo compact />

        <div className="hidden flex-1 items-center justify-center gap-3 xl:flex">
          <AuthLinks />
          <SearchField className="max-w-[190px]" />
          <FollowNotice />
          <WeatherWidget />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <SharesCounter className="hidden 2xl:flex" />
          <div className="hidden items-center gap-3 xl:flex 2xl:hidden">
            <AuthLinks />
            <SearchField className="max-w-[190px]" />
            <FollowNotice />
          </div>
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <span
            className="hidden items-center justify-center rounded border-2 border-navy-900 px-2 py-0.5 text-xs font-bold tracking-wide text-navy-900 md:flex"
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
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="h-10 whitespace-nowrap bg-primary-500 px-4 text-sm font-bold text-white hover:bg-primary-600"
      >
        THEO DÕI
      </Button>
      <NewsletterDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
