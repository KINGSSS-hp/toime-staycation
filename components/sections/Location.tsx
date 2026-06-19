"use client";

import { useTranslations } from "next-intl";
import SectionReveal from "@/components/shared/SectionReveal";

export default function Location() {
  const t = useTranslations("location");

  return (
    <section id="location" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <SectionReveal className="text-center mb-16">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-green mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brown-dark">
            {t("title")}
          </h2>
        </SectionReveal>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <SectionReveal direction="left">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-cream-dark">
              {/* Placeholder for Google Maps embed */}
              <div className="w-full h-full flex items-center justify-center text-text-muted">
                <div className="text-center px-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12 mx-auto mb-3 text-brown/40" strokeWidth="1.5">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <p className="text-sm">{t("map_placeholder")}</p>
                </div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal direction="right" delay={0.15}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-brown-dark mb-2">
                  {t("address_label")}
                </h3>
                <p className="text-text-light">{t("address")}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-brown-dark">
                  {t("distances_label")}
                </h3>
                {(["distance_1", "distance_2", "distance_3"] as const).map(
                  (key) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 text-sm text-text-light"
                    >
                      <div className="w-2 h-2 rounded-full bg-green flex-shrink-0" />
                      <span>{t(key)}</span>
                    </div>
                  )
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-brown-dark mb-2">
                  {t("contact_label")}
                </h3>
                <div className="space-y-2 text-sm text-text-light">
                  <p>{t("phone")}</p>
                  <p>{t("email")}</p>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
