"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { BookingType } from "@/lib/supabase/types";
import { calculateBookingSlot, FAST_FURIOUS_OPTIONS, getFastFuriousPrice } from "@/lib/booking/rules";

interface Props {
  bookingType: BookingType;
  onSelect: (date: Date, hours: number, startHour?: number) => void;
  onBack: () => void;
}

function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "đ";
}

export default function DateTimePicker({ bookingType, onSelect, onBack }: Props) {
  const t = useTranslations("booking_wizard");
  const [dateStr, setDateStr] = useState("");
  const [ffHours, setFfHours] = useState<3 | 4 | 5>(3);
  const [startHour, setStartHour] = useState(10);
  const [error, setError] = useState("");

  const isFastFurious = bookingType === "fast_furious";

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleSubmit = () => {
    if (!dateStr) {
      setError(t("error_select_date"));
      return;
    }

    const date = new Date(dateStr + "T00:00:00");

    const result = isFastFurious
      ? calculateBookingSlot(bookingType, date, ffHours, startHour)
      : calculateBookingSlot(bookingType, date);

    if (!result.valid) {
      if (result.error === "SUNDAY_NOT_ALLOWED") setError(t("error_sunday"));
      else if (result.error === "INVALID_DURATION") setError(t("error_invalid_duration"));
      else if (result.error === "INVALID_START_HOUR") setError(t("error_invalid_start_hour"));
      else setError(result.error || "");
      return;
    }

    setError("");
    onSelect(date, isFastFurious ? ffHours : 0, isFastFurious ? startHour : undefined);
  };

  const previewSlot = dateStr
    ? calculateBookingSlot(
        bookingType,
        new Date(dateStr + "T00:00:00"),
        isFastFurious ? ffHours : undefined,
        isFastFurious ? startHour : undefined
      )
    : null;

  return (
    <div className="bg-white rounded-2xl p-8 border border-border/40 shadow-sm">
      <h3 className="text-xl font-semibold text-brown-dark mb-2">
        {t("select_date")}
      </h3>
      <p className="text-sm text-text-muted mb-6">
        {t(`type_${bookingType}`)}
      </p>

      <div className="space-y-5">
        {/* Fast & Furious: chọn gói */}
        {isFastFurious && (
          <div>
            <label className="block text-sm font-medium text-text-light mb-3">
              {t("select_package")}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {FAST_FURIOUS_OPTIONS.map((opt) => (
                <button
                  key={opt.hours}
                  onClick={() => { setFfHours(opt.hours as 3 | 4 | 5); setError(""); }}
                  className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all duration-200 ${
                    ffHours === opt.hours
                      ? "border-brown bg-brown/5"
                      : "border-border/50 hover:border-brown/30"
                  }`}
                >
                  <p className="text-lg font-bold text-brown-dark">{opt.hours}h</p>
                  <p className="text-xs text-text-muted mt-1">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ngày */}
        <div>
          <label className="block text-sm font-medium text-text-light mb-2">
            {t("date_label")}
          </label>
          <input
            type="date"
            value={dateStr}
            min={minDate}
            onChange={(e) => { setDateStr(e.target.value); setError(""); }}
            className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-cream-light/50 focus:outline-none focus:border-brown focus:ring-1 focus:ring-brown/20 transition-colors"
          />
        </div>

        {/* Fast & Furious: chọn giờ bắt đầu */}
        {isFastFurious && (
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              {t("start_time")}
            </label>
            <div className="flex items-center gap-3">
              <select
                value={startHour}
                onChange={(e) => { setStartHour(parseInt(e.target.value)); setError(""); }}
                className="flex-1 px-4 py-3 border border-border rounded-xl text-sm bg-cream-light/50 focus:outline-none focus:border-brown focus:ring-1 focus:ring-brown/20 transition-colors"
              >
                {Array.from({ length: 25 }, (_, i) => i).map((h) => (
                  <option key={h} value={h}>
                    {h === 24 ? "00" : String(h).padStart(2, "0")}:00{h === 24 ? " (+1 ngày)" : ""}
                  </option>
                ))}
              </select>
              <span className="text-sm text-text-muted">
                → {(() => {
                  const endH = startHour + ffHours;
                  const display = endH >= 24 ? `${String(endH - 24).padStart(2, "0")}:00 (+1 ngày)` : `${String(endH).padStart(2, "0")}:00`;
                  return display;
                })()}
              </span>
            </div>
          </div>
        )}

        {/* Preview */}
        {previewSlot?.valid && previewSlot.slot && (
          <div className="bg-green/5 rounded-xl p-4 border border-green/10">
            <p className="text-xs font-medium text-green uppercase tracking-wider mb-2">
              {t("time_preview")}
            </p>
            <div className="text-sm space-y-1">
              <div>
                <span className="text-text-muted">Check-in: </span>
                <span className="font-medium text-brown-dark">
                  {previewSlot.slot.start_at.toLocaleString("vi-VN")}
                </span>
              </div>
              <div>
                <span className="text-text-muted">Check-out: </span>
                <span className="font-medium text-brown-dark">
                  {previewSlot.slot.end_at.toLocaleString("vi-VN")}
                </span>
              </div>
              {isFastFurious && (
                <div className="pt-1">
                  <span className="text-text-muted">{t("total")}: </span>
                  <span className="font-bold text-brown">
                    {formatPrice(getFastFuriousPrice(ffHours))}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onBack}
            className="flex-1 py-3 border border-border rounded-xl text-sm font-medium text-text-light hover:bg-cream transition-colors cursor-pointer"
          >
            {t("back")}
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-brown text-white rounded-xl text-sm font-semibold hover:bg-brown-dark transition-colors cursor-pointer"
          >
            {t("check_rooms")}
          </button>
        </div>
      </div>
    </div>
  );
}
