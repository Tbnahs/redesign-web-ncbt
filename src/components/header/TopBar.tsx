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
    <div className="w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto w-full max-w-[1680px] px-6">
        <div className="flex w-full items-center gap-3 py-3 max-[1279px]:flex-wrap">
          <BrandLogo compact />
          <AuthLinks className="shrink-0 whitespace-nowrap" />
          <SearchField className="min-w-[160px] max-w-[360px] flex-[1_1_200px] shrink-0" />
          <FollowNotice />
          <SharesCounter className="flex shrink-0 px-2.5 py-1 text-xs sm:text-sm" />

          <div className="ml-auto flex shrink-0 items-center gap-2 whitespace-nowrap">
            <LanguageSwitcher />
            <span
              className="hidden shrink-0 items-center justify-center rounded border-2 border-navy-900 px-2 py-0.5 text-xs font-bold tracking-wide text-navy-900 md:flex"
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
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy-900 text-white transition-colors duration-200 hover:bg-navy-700"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex w-full items-center justify-end pb-2 pt-0">
          <WeatherWidget />
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
        className="h-10 shrink-0 whitespace-nowrap bg-primary-500 px-4 text-sm font-bold text-white hover:bg-primary-600"
      >
        THEO DÕI
      </Button>
      <NewsletterDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
