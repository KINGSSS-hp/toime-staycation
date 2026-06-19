"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";

const navItems: { key: string; section: string | null; href?: string }[] = [
  { key: "about", section: "about" },
  { key: "rooms", section: "rooms" },
  { key: "reviews", section: "reviews" },
  { key: "location", section: "location" },
  { key: "booking", section: null, href: "/booking" },
];

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const otherLocale = locale === "vi" ? "en" : "vi";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/" || pathname === "";

  function getHref(item: (typeof navItems)[number]) {
    if (item.href) return item.href;
    if (isHome) return `#${item.section}`;
    return `/${locale}#${item.section}`;
  }

  function renderNavLink(item: (typeof navItems)[number], mobile = false) {
    const href = getHref(item);
    const cls = mobile
      ? "block px-4 py-3 text-sm font-medium text-text-light hover:text-brown hover:bg-cream rounded-xl transition-colors duration-200"
      : "text-sm font-medium text-text-light hover:text-brown transition-colors duration-200";

    if (item.href) {
      return (
        <Link
          href={item.href}
          onClick={mobile ? () => setMobileOpen(false) : undefined}
          className={cls}
        >
          {t(item.key)}
        </Link>
      );
    }

    return (
      <a
        href={href}
        onClick={mobile ? () => setMobileOpen(false) : undefined}
        className={cls}
      >
        {t(item.key)}
      </a>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-4 mt-4">
        <nav className={`max-w-6xl mx-auto backdrop-blur-md rounded-2xl border border-border/50 px-6 py-3 flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "bg-white/30 shadow-none"
            : "bg-white/85 shadow-sm"
        }`}>
          <Link href="/" className="flex-shrink-0">
            <img
              src="/LOGO.jpg"
              alt="ToiME Staycation"
              width={36}
              height={36}
              style={{ width: 36, height: 36, objectFit: "contain" }}
            />
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.key}>{renderNavLink(item)}</li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href={pathname}
              locale={otherLocale}
              className="text-xs font-semibold uppercase px-3 py-1.5 rounded-lg bg-cream text-brown hover:bg-cream-dark transition-colors duration-200"
            >
              {otherLocale.toUpperCase()}
            </Link>

            <button
              className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span className={`block w-5 h-0.5 bg-brown transition-transform duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-brown transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-brown transition-transform duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={`md:hidden mt-2 max-w-6xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-border/50 p-4 transition-all duration-200 origin-top ${
            mobileOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
          }`}
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.key}>{renderNavLink(item, true)}</li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
