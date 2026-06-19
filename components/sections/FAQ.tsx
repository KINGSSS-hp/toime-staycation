"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import SectionReveal from "@/components/shared/SectionReveal";

const faqKeys = ["faq_1", "faq_2", "faq_3", "faq_4", "faq_5"] as const;

function FAQItem({ questionKey }: { questionKey: string }) {
  const t = useTranslations("faq");
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-base font-medium text-brown-dark group-hover:text-brown transition-colors pr-4">
          {t(`${questionKey}.q`)}
        </span>
        <span
          className="text-xl text-brown flex-shrink-0 leading-none transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-250 ease-in-out"
        style={{
          maxHeight: open ? "200px" : "0",
          opacity: open ? 1 : 0,
        }}
      >
        <p className="pb-5 text-sm text-text-light leading-relaxed">
          {t(`${questionKey}.a`)}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const t = useTranslations("faq");

  return (
    <section id="faq" className="py-24 px-6 bg-cream-light">
      <div className="max-w-3xl mx-auto">
        <SectionReveal className="text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-green mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brown-dark">
            {t("title")}
          </h2>
        </SectionReveal>

        <SectionReveal>
          <div className="bg-white rounded-2xl px-7 border border-border/40 shadow-sm">
            {faqKeys.map((key) => (
              <FAQItem key={key} questionKey={key} />
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
