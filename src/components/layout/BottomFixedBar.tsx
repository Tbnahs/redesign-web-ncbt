import {
  ArrowUp,
  ChevronRight,
  Menu,
  MessageCircle,
} from "lucide-react";
import { FacebookLogo, XLogo, YouTubeLogo } from "@/components/icons/SocialIcons";
import { Link } from "@tanstack/react-router";
import { WeatherWidget } from "@/components/header/WeatherWidget";
import { SharesCounter } from "@/components/common/SharesCounter";
import { useLocale } from "@/i18n";

export function BottomFixedBar() {
  const { t } = useLocale();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 hidden border-t border-neutral-200 bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleScrollTop}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#3385cd] text-white shadow-sm transition-colors hover:bg-[#2b6eaf]"
            aria-label={t("common.backToTop")}
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleScrollTop}
            className="inline-flex items-center gap-2 rounded-md bg-[#3385cd] px-3 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-[#2b6eaf]"
          >
            <span>{t("common.back")}</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/60 bg-white/10">
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            </span>
            <span>{t("common.toTop")}</span>
          </button>
        </div>

        <div className="flex-1 justify-center px-4">
          <div className="flex justify-center">
            <WeatherWidget compact />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-neutral-700">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="source-social-link source-social-link--facebook source-social-link--compact"
            >
              <FacebookLogo className="source-brand-logo" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="source-social-link source-social-link--x source-social-link--compact"
            >
              <XLogo className="source-brand-logo" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCEHxZm8ljXO-St5-z0em3BA/featured"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="source-social-link source-social-link--youtube source-social-link--compact"
            >
              <YouTubeLogo className="source-youtube-logo" />
            </a>
          </div>

          <div className="hidden xl:flex">
            <SharesCounter className="flex" />
          </div>

          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 transition-colors hover:border-[#3385cd] hover:text-[#3385cd]"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
