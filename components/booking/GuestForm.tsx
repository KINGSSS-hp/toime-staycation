"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  onSubmit: (data: {
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    note: string;
  }) => void;
  onBack: () => void;
  initialData: {
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    note: string;
  };
}

export default function GuestForm({ onSubmit, onBack, initialData }: Props) {
  const t = useTranslations("booking_wizard");
  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!form.guestName.trim() || form.guestName.trim().length < 2) {
      errs.guestName = t("error_name");
    }

    if (!/^(\+84|0)\d{9,10}$/.test(form.guestPhone)) {
      errs.guestPhone = t("error_phone");
    }

    if (form.guestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.guestEmail)) {
      errs.guestEmail = t("error_email");
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-xl text-sm bg-cream-light/50 focus:outline-none focus:border-brown focus:ring-1 focus:ring-brown/20 transition-colors ${
      errors[field] ? "border-red-300" : "border-border"
    }`;

  return (
    <div className="bg-white rounded-2xl p-8 border border-border/40 shadow-sm">
      <h3 className="text-xl font-semibold text-brown-dark mb-2">
        {t("guest_info")}
      </h3>
      <p className="text-sm text-text-muted mb-6">
        {t("guest_info_desc")}
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-light mb-1.5">
            {t("name_label")} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.guestName}
            onChange={(e) => setForm({ ...form, guestName: e.target.value })}
            placeholder={t("name_placeholder")}
            className={inputClass("guestName")}
          />
          {errors.guestName && (
            <p className="text-xs text-red-500 mt-1">{errors.guestName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-light mb-1.5">
            {t("phone_label")} <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={form.guestPhone}
            onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
            placeholder="0912 345 678"
            className={inputClass("guestPhone")}
          />
          {errors.guestPhone && (
            <p className="text-xs text-red-500 mt-1">{errors.guestPhone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-light mb-1.5">
            {t("email_label")}
          </label>
          <input
            type="email"
            value={form.guestEmail}
            onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
            placeholder="email@example.com"
            className={inputClass("guestEmail")}
          />
          {errors.guestEmail && (
            <p className="text-xs text-red-500 mt-1">{errors.guestEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-light mb-1.5">
            {t("note_label")}
          </label>
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder={t("note_placeholder")}
            rows={3}
            className={`${inputClass("note")} resize-none`}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
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
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
