"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState, useEffect } from "react";

export default function Hero() {
  const t = useTranslations("hero");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setReady(true));
  }, []);

  const r = (delay: number) =>
    `hero-reveal ${ready ? "revealed" : ""}`;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1470723710355-95304d8aece4?w=1920&q=80')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-brown-dark/40 via-brown/30 to-cream/80" />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1
          className={`text-5xl md:text-7xl font-bold text-white mb-4 leading-tight ${r(0.4)}`}
          style={{ animationDelay: "0.45s" }}
        >
          ToiME Staycation
        </h1>

        <p
          className={`text-xl md:text-2xl text-cream/90 font-light mb-3 ${r(0.6)}`}
          style={{ animationDelay: "0.65s" }}
        >
          {t("tagline")}
        </p>

        <p
          className={`text-base text-cream/70 mb-10 max-w-lg mx-auto ${r(0.8)}`}
          style={{ animationDelay: "0.85s" }}
        >
          {t("subtitle")}
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center ${r(1)}`}
          style={{ animationDelay: "1.05s" }}
        >
          <Link
            href="/booking"
            className="px-8 py-3.5 bg-brown text-white rounded-xl font-medium hover:bg-brown-dark transition-colors duration-200 shadow-lg shadow-brown/20"
          >
            {t("cta_booking")}
          </Link>
          <a
            href="#rooms"
            className="px-8 py-3.5 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl font-medium hover:bg-white/30 transition-colors duration-200"
          >
            {t("cta_explore")}
          </a>
        </div>
      </div>

    </section>
  );
}
