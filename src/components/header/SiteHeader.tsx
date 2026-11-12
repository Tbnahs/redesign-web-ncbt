import { useState } from "react";
import { UkFlag, VietnamFlag } from "@/components/icons/FlagIcons";
import { Link, useLocation } from "@tanstack/react-router";
import { Globe, Menu, ChevronDown, Home, UserRound } from "lucide-react";
import { mainNav } from "@/config/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { SearchField } from "./SearchField";
import { WeatherWidget } from "./WeatherWidget";
import { AccountDialog } from "./AccountDialog";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLocale, translateNavLabel } from "@/i18n";
export function SiteHeader() {
  const { locale, setLocale } = useLocale();
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(false);
  const [account, setAccount] = useState(false);
  const vi = locale === "vi";
  return (
    <header className="source-site-header">
      <div className="source-container source-masthead">
        <BrandLogo />
        <div className="source-utilities">
          <div className="source-utility-top">
            <button onClick={() => setAccount(true)} className="source-account">
              <UserRound size={15} />
              {vi ? "Đăng nhập / Đăng ký" : "Sign in / Register"}
            </button>
            <SearchField />
            <details className="source-language">
              <summary aria-label={vi ? "Chọn ngôn ngữ" : "Choose language"}>
                <Globe size={18} />
                <span>{vi ? "VI" : "EN"}</span>
                <ChevronDown size={12} />
              </summary>
              <div>
                <button
                  onClick={(e) => {
                    setLocale("vi");
                    e.currentTarget.closest("details")?.removeAttribute("open");
                  }}
                >
                  <VietnamFlag className="h-3 w-5 shrink-0" /> Tiếng Việt
                </button>
                <button
                  onClick={(e) => {
                    setLocale("en");
                    e.currentTarget.closest("details")?.removeAttribute("open");
                  }}
                >
                  <UkFlag className="h-3 w-5 shrink-0" /> English
                </button>
              </div>
            </details>
          </div>
          <div className="source-utility-bottom">
            <Link to="/lien-he">{vi ? "LIÊN HỆ" : "CONTACT"}</Link>
            <WeatherWidget />
            <div className="source-header-social">
              <a href="https://www.facebook.com/GS1Vietnam" aria-label="Facebook">
                f
              </a>
              <a href="https://www.youtube.com/" aria-label="YouTube">
                ▶
              </a>
            </div>
            <span className="source-share-count">
              <b>128M</b>
              <small>Shares</small>
            </span>
            <span className="source-gs1">GS1</span>
            <button onClick={() => setMenu(true)} aria-label={vi ? "Mở menu" : "Open menu"}>
              <Menu />
            </button>
          </div>
        </div>
        <button className="source-mobile-menu" onClick={() => setMenu(true)} aria-label="Mở menu">
          <Menu />
        </button>
      </div>
      <nav className="source-nav" aria-label="Điều hướng chính">
        <div className="source-container">
          {mainNav.map((item, i) => (
            <div className="source-nav-item" key={item.path}>
              <Link
                to={item.path as "/"}
                data-active={i === 0 ? pathname === "/" : pathname.startsWith(item.path)}
              >
                {i === 0 ? <Home size={17} /> : translateNavLabel(item.label, locale)}
                {item.children && <ChevronDown size={12} />}
              </Link>
              {item.children && (
                <div className="source-dropdown">
                  {item.children.map((c) => (
                    <Link to={c.path as "/"} key={c.path}>
                      {translateNavLabel(c.label, locale)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
      <Dialog open={menu} onOpenChange={setMenu}>
        <DialogContent className="source-menu-dialog">
          <DialogTitle>{vi ? "Danh mục" : "Navigation"}</DialogTitle>
          <DialogDescription>
            {vi ? "Cổng thông tin NCBT" : "NCBT information portal"}
          </DialogDescription>
          <SearchField />
          <div className="source-menu-grid">
            {mainNav.map((item) => (
              <div key={item.path}>
                <Link to={item.path as "/"} onClick={() => setMenu(false)}>
                  {translateNavLabel(item.label, locale)}
                </Link>
                {item.children?.map((c) => (
                  <Link to={c.path as "/"} key={c.path} onClick={() => setMenu(false)}>
                    {translateNavLabel(c.label, locale)}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <AccountDialog open={account} onOpenChange={setAccount} />
    </header>
  );
}
