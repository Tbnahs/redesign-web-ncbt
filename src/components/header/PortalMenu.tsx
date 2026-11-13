import { Link } from "@tanstack/react-router";
import { FacebookLogo, XLogo, YouTubeLogo } from "@/components/icons/SocialIcons";
import { Menu, UserRound, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { mainNav } from "@/config/navigation";
import { useLocale, translateNavLabel } from "@/i18n";
export function PortalMenu({
  open,
  onOpenChange,
  onAccount,
  adminSession,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccount: () => void;
  adminSession: boolean;
}) {
  const { locale } = useLocale();
  const vi = locale === "vi";
  const close = () => onOpenChange(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="source-menu-dialog" overlayClassName="portal-menu-overlay">
        <DialogTitle className="sr-only">
          {vi ? "Danh mục website" : "Website navigation"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {vi ? "Các chuyên mục của Cổng thông tin NCBT" : "NCBT information portal sections"}
        </DialogDescription>
        <div className="source-menu-desktop">
          <div className="source-menu-columns">
            {mainNav
              .filter((item) => !item.megaMenuHidden)
              .map((item) => (
                <section key={item.path}>
                  <h2>
                    <Link to={item.path as "/"} onClick={close}>
                      {translateNavLabel(item.label, locale)}
                    </Link>
                  </h2>
                  {item.children && (
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <Link to={child.path as "/"} onClick={close}>
                            {translateNavLabel(child.label, locale)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
          </div>
          <div className="source-menu-bottom">
            <div className="source-menu-networks">
              <a className="source-social-link source-social-link--facebook" href="https://www.facebook.com/msmvquocgia" aria-label="Facebook">
                <FacebookLogo className="source-brand-logo" />
                f
              </a>
              <a className="source-social-link source-social-link--x" href="https://x.com" aria-label="X">
                <XLogo className="source-brand-logo" />
              </a>
              <a className="source-social-link source-social-link--youtube"
                href="https://www.youtube.com/channel/UCEHxZm8ljXO-St5-z0em3BA/featured"
                aria-label="YouTube"
              >
                <YouTubeLogo className="source-youtube-logo" />
                ▶
              </a>
              <a className="source-email-link" href="mailto:msmv@nbc.gov.vn" aria-label="Email">
                ✉
              </a>
            </div>
            <span>
              128M <small>Shares</small>
            </span>
          </div>
        </div>
        <div className="source-menu-mobile">
          <div className="source-drawer-top">
            <DialogClose asChild>
              <button aria-label={vi ? "Đóng menu" : "Close menu"}>
                <Menu size={21} />
              </button>
            </DialogClose>
            <button className="source-drawer-account" onClick={onAccount}>
              {adminSession
                ? vi
                  ? "Trang quản trị"
                  : "Admin"
                : vi
                  ? "Đăng nhập / đăng ký"
                  : "Sign in / Register"}
              <UserRound size={16} />
            </button>
          </div>
          <nav aria-label={vi ? "Điều hướng di động" : "Mobile navigation"}>
            {mainNav.map((item) => (
              <section key={item.path}>
                {item.children ? (
                  <details open>
                    <summary>
                      {translateNavLabel(item.label, locale)}
                      <ChevronDown size={13} />
                    </summary>
                    <div>
                      {item.children.map((child) => (
                        <Link key={child.path} to={child.path as "/"} onClick={close}>
                          {translateNavLabel(child.label, locale)}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link to={item.path as "/"} onClick={close}>
                    {translateNavLabel(item.label, locale)}
                  </Link>
                )}
              </section>
            ))}
          </nav>
        </div>
      </DialogContent>
    </Dialog>
  );
}
