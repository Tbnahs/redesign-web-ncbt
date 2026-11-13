import { useState, useEffect } from "react";
import { UkFlag, VietnamFlag } from "@/components/icons/FlagIcons";
import { FacebookLogo, XLogo, YouTubeLogo } from "@/components/icons/SocialIcons";
import { Link, useLocation } from "@tanstack/react-router";
import { Globe, Menu, ChevronDown, Home } from "lucide-react";
import { mainNav } from "@/config/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { SearchField } from "./SearchField";
import { WeatherWidget } from "./WeatherWidget";
import { AccountDialog } from "./AccountDialog";
import { PortalMenu } from "./PortalMenu";
import { useLocale, translateNavLabel } from "@/i18n";
export function SiteHeader() {
  const [adminSession, setAdminSession] = useState(false);
  useEffect(() => setAdminSession(sessionStorage.getItem("ncbt-admin-auth") === "1"), []);
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
              <a className="source-social-link source-social-link--facebook" href="https://www.facebook.com/GS1Vietnam" aria-label="Facebook">
                <FacebookLogo className="source-brand-logo" />
                f
              </a>
              <a className="source-social-link source-social-link--x" href="https://x.com" aria-label="X">
                <XLogo className="source-brand-logo" />
              </a>
              <a className="source-social-link source-social-link--youtube" href="https://www.youtube.com/channel/UCEHxZm8ljXO-St5-z0em3BA/featured" aria-label="YouTube" target="_blank" rel="noreferrer">
                <YouTubeLogo className="source-youtube-logo" />
                ▶
              </a>
            </div>
            <span className="source-share-count">
              <b>128M</b>
              <small>Shares</small>
            </span>
            <img
              className="source-gs1"
              src="/branding/gs1-logo.png"
              alt="GS1"
              width="440"
              height="368"
            />
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
      <PortalMenu
        open={menu}
        onOpenChange={setMenu}
        adminSession={adminSession}
        onAccount={() => {
          setMenu(false);
          if (adminSession) window.location.assign("/admin");
          else setTimeout(() => setAccount(true), 150);
        }}
      />
      <AccountDialog open={account} onOpenChange={setAccount} />
    </header>
  );
}
