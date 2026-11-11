import { useCallback, useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { MainNav } from "@/components/header/MainNav";
import { MegaMenu } from "@/components/header/MegaMenu";
import { TopBar } from "@/components/header/TopBar";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <TopBar menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} />
      <MainNav />
      <MegaMenu open={menuOpen} onClose={closeMenu} />
    </header>
  );
}
