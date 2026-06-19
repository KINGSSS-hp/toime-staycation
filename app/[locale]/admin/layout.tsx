"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("admin");
  const pathname = usePathname();

  const isLoginPage = pathname.includes("/login");

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/admin", label: t("calendar"), icon: "📅" },
    { href: "/admin/revenue", label: t("revenue"), icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Admin header */}
      <header className="bg-white border-b border-border/50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-bold text-brown">
              ToiME
            </Link>
            <span className="text-xs font-medium uppercase tracking-wider text-text-muted bg-cream px-2.5 py-1 rounded-full">
              Admin
            </span>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname.endsWith("/admin")
                  : pathname.includes(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brown/10 text-brown"
                      : "text-text-light hover:bg-cream hover:text-brown-dark"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <Link
            href="/"
            className="text-xs text-text-muted hover:text-brown transition-colors"
          >
            ← {t("back_to_site")}
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
