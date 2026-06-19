"use client";

import { useTranslations } from "next-intl";
import SectionReveal, {
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/SectionReveal";

const amenities = [
  { key: "wifi", icon: "📶" },
  { key: "parking", icon: "🅿️" },
  { key: "ac", icon: "❄️" },
  { key: "hot_water", icon: "🚿" },
  { key: "garden", icon: "🌿" },
  { key: "balcony", icon: "🏔️" },
  { key: "fridge", icon: "🧊" },
] as const;

export default function Amenities() {
  const t = useTranslations();

  return (
    <section id="amenities" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <SectionReveal className="text-center mb-16">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-green mb-3">
            {t("common.amenities")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brown-dark">
            {t("amenities.title")}
          </h2>
        </SectionReveal>

        <StaggerContainer
          className="grid grid-cols-2 sm:grid-cols-4 gap-5"
          staggerDelay={0.08}
        >
          {amenities.map((a, i) => (
            <StaggerItem key={a.key} index={i}>
              <div className="flex flex-col items-center gap-3 py-6 px-4 rounded-2xl bg-cream-light/60 border border-border/40">
                <span className="text-3xl" role="img" aria-hidden="true">
                  {a.icon}
                </span>
                <span className="text-sm font-medium text-text-light">
                  {t(`amenities.${a.key}`)}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
