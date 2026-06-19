"use client";

import { useTranslations } from "next-intl";
import SectionReveal, {
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/SectionReveal";

const reviews = [
  { key: "review_1", avatar: "NT", rating: 5 },
  { key: "review_2", avatar: "TH", rating: 5 },
  { key: "review_3", avatar: "LM", rating: 4 },
] as const;

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill={i < count ? "currentColor" : "none"} stroke="currentColor" className="w-4 h-4">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.062 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const t = useTranslations("reviews");

  return (
    <section id="reviews" className="py-24 px-6 bg-cream-light">
      <div className="max-w-5xl mx-auto">
        <SectionReveal className="text-center mb-16">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-green mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brown-dark">
            {t("title")}
          </h2>
        </SectionReveal>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          staggerDelay={0.15}
        >
          {reviews.map((r, i) => (
            <StaggerItem key={r.key} index={i}>
              <div className="bg-white rounded-2xl p-7 border border-border/40 shadow-sm h-full flex flex-col">
                <Stars count={r.rating} />
                <p className="text-text-light leading-relaxed mt-4 mb-6 flex-1 italic">
                  &ldquo;{t(`${r.key}.text`)}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brown/10 flex items-center justify-center text-sm font-semibold text-brown">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brown-dark">
                      {t(`${r.key}.name`)}
                    </p>
                    <p className="text-xs text-text-muted">
                      {t(`${r.key}.date`)}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
