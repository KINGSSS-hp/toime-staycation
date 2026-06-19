"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/SectionReveal";
import SectionReveal from "@/components/shared/SectionReveal";

const bookingTypes = [
  {
    key: "good_morning",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <circle cx="24" cy="20" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M24 6V2M24 38v-4M10 20H6M42 20h-4M12.3 8.3l-2.8-2.8M38.5 8.3l2.8-2.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 40h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    timeRange: "09:00 → 18:00",
    hasSundayNote: true,
  },
  {
    key: "midnight_hot",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <path d="M30 6c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 2.208 0 4.304-.476 6.19-1.332A17 17 0 0 1 14 24 17 17 0 0 1 25.81 7.332C27.696 6.476 28.792 6 30 6z" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="12" r="1.5" fill="currentColor" />
        <circle cx="38" cy="18" r="1" fill="currentColor" />
        <circle cx="36" cy="8" r="1" fill="currentColor" />
      </svg>
    ),
    timeRange: "21:00 → 12:00",
    hasSundayNote: false,
  },
  {
    key: "overnight",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <rect x="8" y="16" width="32" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M8 22h32" stroke="currentColor" strokeWidth="2" />
        <path d="M16 16v-4h16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="30" r="2" fill="currentColor" />
        <circle cx="32" cy="30" r="2" fill="currentColor" />
      </svg>
    ),
    timeRange: "14:00 → 12:00 (+1)",
    hasSundayNote: false,
  },
  {
    key: "fast_furious",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
        <path d="M24 14v10l7 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 8l-3-3M32 8l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    timeRange: "3h · 4h · 5h",
    hasSundayNote: false,
  },
];

export default function BookingPreview() {
  const t = useTranslations();

  return (
    <section id="booking" className="py-24 px-6 bg-cream-light">
      <div className="max-w-6xl mx-auto">
        <SectionReveal className="text-center mb-16">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-green mb-3">
            {t("nav.booking")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brown-dark">
            {t("booking_preview.title")}
          </h2>
        </SectionReveal>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          staggerDelay={0.12}
        >
          {bookingTypes.map((type, i) => (
            <StaggerItem key={type.key} index={i}>
              <Link
                href="/booking"
                className="group block bg-white rounded-2xl p-7 shadow-sm border border-border/60 hover:shadow-md hover:border-brown/20 transition-all duration-300 cursor-pointer h-full"
              >
                <div className="text-brown/70 group-hover:text-brown transition-colors duration-200 mb-5">
                  {type.icon}
                </div>
                <h3 className="text-lg font-semibold text-brown-dark mb-1.5">
                  {t(`booking_types.${type.key}`)}
                </h3>
                <p className="text-sm text-text-muted font-mono tracking-wide mb-2">
                  {type.timeRange}
                </p>
                <p className="text-sm text-text-light">
                  {t(`booking_types.${type.key}_desc`)}
                </p>
                {type.hasSundayNote && (
                  <span className="inline-block mt-4 text-xs bg-cream px-3 py-1.5 rounded-full text-brown font-medium">
                    {t("common.sunday_closed")}
                  </span>
                )}
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
