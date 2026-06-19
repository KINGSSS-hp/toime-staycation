"use client";

import { useTranslations } from "next-intl";
import SectionReveal, {
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/SectionReveal";

const metrics = [
  { value: "6+", labelKey: "rooms_count" },
  { value: "4", labelKey: "booking_types" },
  { value: "24/7", labelKey: "support" },
  { value: "100%", labelKey: "satisfaction" },
] as const;

export default function Metrics() {
  const t = useTranslations("metrics");

  return (
    <section className="py-16 bg-brown">
      <StaggerContainer className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <StaggerItem key={m.labelKey} index={i}>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                {m.value}
              </p>
              <p className="text-sm text-cream/80">{t(m.labelKey)}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
