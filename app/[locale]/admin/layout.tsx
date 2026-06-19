"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("admin");
  const pathname = usePathname();

  const isLoginPage = pathname.includes("/login");
  if (isLoginPage) return <>{children}</>;

  const navItems = [
    { href: "/admin", label: t("dashboard"), icon: "📊", exact: true },
    { href: "/admin/bookings", label: t("bookings"), icon: "📋", exact: false },
    { href: "/admin/calendar", label: t("calendar"), icon: "📅", exact: false },
    { href: "/admin/revenue", label: t("revenue"), icon: "💰", exact: false },
  ];

  return (
    <div className="min-h-screen bg-cream-light">
      <header className="bg-white border-b border-border/50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="/LOGO.jpg" alt="ToiME" width={28} height={28} style={{ width: 28, height: 28, objectFit: "contain" }} />
              <span className="text-lg font-bold text-brown hidden sm:inline">ToiME</span>
            </Link>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white bg-brown px-2 py-0.5 rounded-full">Admin</span>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname.endsWith("/admin") || pathname.endsWith("/admin/")
                : pathname.includes(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive ? "bg-brown/10 text-brown" : "text-text-light hover:bg-cream hover:text-brown-dark"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <Link href="/" className="text-xs text-text-muted hover:text-brown transition-colors">
            ← {t("back_to_site")}
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
