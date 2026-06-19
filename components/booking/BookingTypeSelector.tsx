"use client";

import { useTranslations } from "next-intl";
import type { BookingType } from "@/lib/supabase/types";

const types: { key: BookingType; time: string }[] = [
  { key: "good_morning", time: "09:00 → 18:00" },
  { key: "midnight_hot", time: "21:00 → 12:00" },
  { key: "overnight", time: "14:00 → 12:00 (+1)" },
  { key: "fast_furious", time: "3h · 4h · 5h" },
];

interface Props {
  onSelect: (type: BookingType) => void;
}

export default function BookingTypeSelector({ onSelect }: Props) {
  const t = useTranslations();

  return (
    <div>
      <h3 className="text-xl font-semibold text-brown-dark mb-2 text-center">
        {t("booking_wizard.select_type")}
      </h3>
      <p className="text-sm text-text-muted mb-8 text-center">
        {t("booking_wizard.select_type_desc")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {types.map((type) => (
          <button
            key={type.key}
            onClick={() => onSelect(type.key)}
            className="group text-left bg-white rounded-2xl p-6 border border-border/50 hover:border-brown/30 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <h4 className="text-lg font-semibold text-brown-dark mb-1 group-hover:text-brown transition-colors">
              {t(`booking_types.${type.key}`)}
            </h4>
            <p className="text-xs font-mono text-text-muted tracking-wide mb-2">
              {type.time}
            </p>
            <p className="text-sm text-text-light">
              {t(`booking_types.${type.key}_desc`)}
            </p>
            {type.key === "good_morning" && (
              <span className="inline-block mt-3 text-xs bg-cream px-3 py-1 rounded-full text-brown font-medium">
                {t("common.sunday_closed")}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
