"use client";

import { useTranslations } from "next-intl";
import SectionReveal from "@/components/shared/SectionReveal";

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-24 px-6 bg-cream-light">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <SectionReveal direction="left">
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80"
              alt="ToiME Staycation"
              className="w-full h-auto object-cover object-center"
              loading="lazy"
            />
          </div>
        </SectionReveal>

        <SectionReveal direction="right" delay={0.15}>
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-green mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brown-dark mb-6 leading-snug">
            {t("title")}
          </h2>
          <p className="text-text-light leading-relaxed mb-6">
            {t("description")}
          </p>
          <p className="text-text-light leading-relaxed">
            {t("description_2")}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
