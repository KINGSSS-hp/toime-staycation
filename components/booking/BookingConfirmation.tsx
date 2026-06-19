"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { BookingState } from "./BookingWizard";

interface Props {
  state: BookingState;
  bookingId: string;
  onReset: () => void;
}

export default function BookingConfirmation({ state, bookingId, onReset }: Props) {
  const t = useTranslations("booking_wizard");

  const bankName = process.env.NEXT_PUBLIC_BANK_NAME || "Vietcombank";
  const bankAccount = process.env.NEXT_PUBLIC_BANK_ACCOUNT || "1234567890";
  const bankHolder = process.env.NEXT_PUBLIC_BANK_HOLDER || "NGUYEN VAN A";

  const totalPrice = state.price;

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-16 h-16 mx-auto mb-6 rounded-full bg-green/10 flex items-center justify-center"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-green" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </motion.div>

      <h3 className="text-2xl font-bold text-brown-dark mb-2">
        {t("success_title")}
      </h3>
      <p className="text-sm text-text-muted mb-1">
        {t("success_desc")}
      </p>
      <p className="text-xs font-mono text-text-muted mb-8">
        ID: {bookingId.slice(0, 8).toUpperCase()}
      </p>

      {/* Booking summary */}
      <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm text-left mb-6">
        <h4 className="text-sm font-semibold text-brown-dark mb-4 uppercase tracking-wider">
          {t("summary")}
        </h4>
        <dl className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-muted">{t("step_type")}</dt>
            <dd className="font-medium text-brown-dark">{state.bookingType}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">{t("step_room")}</dt>
            <dd className="font-medium text-brown-dark">{state.roomName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Check-in</dt>
            <dd className="font-medium text-brown-dark">
              {state.startAt?.toLocaleString("vi-VN")}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Check-out</dt>
            <dd className="font-medium text-brown-dark">
              {state.endAt?.toLocaleString("vi-VN")}
            </dd>
          </div>
          {totalPrice && (
            <div className="flex justify-between pt-2.5 border-t border-border/30">
              <dt className="font-medium text-text-light">{t("total")}</dt>
              <dd className="text-lg font-bold text-brown">
                {totalPrice.toLocaleString("vi-VN")}đ
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Bank transfer info */}
      <div className="bg-cream rounded-2xl p-6 border border-brown/10 text-left mb-8">
        <h4 className="text-sm font-semibold text-brown-dark mb-4 uppercase tracking-wider">
          {t("payment_info")}
        </h4>
        <dl className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-muted">{t("bank")}</dt>
            <dd className="font-medium text-brown-dark">{bankName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">{t("account")}</dt>
            <dd className="font-mono font-medium text-brown-dark">{bankAccount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">{t("holder")}</dt>
            <dd className="font-medium text-brown-dark">{bankHolder}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">{t("transfer_content")}</dt>
            <dd className="font-mono font-medium text-brown">
              TOIME {bookingId.slice(0, 8).toUpperCase()}
            </dd>
          </div>
        </dl>
      </div>

      <button
        onClick={onReset}
        className="px-8 py-3 bg-brown text-white rounded-xl font-medium hover:bg-brown-dark transition-colors cursor-pointer"
      >
        {t("book_another")}
      </button>
    </div>
  );
}
