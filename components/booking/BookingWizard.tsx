"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { BookingType } from "@/lib/supabase/types";
import { calculateBookingSlot, getFastFuriousPrice, type FastFuriousHours } from "@/lib/booking/rules";
import BookingTypeSelector from "./BookingTypeSelector";
import DateTimePicker from "./DateTimePicker";
import RoomPicker from "./RoomPicker";
import GuestForm from "./GuestForm";
import BookingConfirmation from "./BookingConfirmation";

export interface BookingState {
  step: number;
  bookingType: BookingType | null;
  date: Date | null;
  hours: number;
  startHour: number | null;
  roomId: string | null;
  roomName: string | null;
  price: number | null;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  note: string;
  startAt: Date | null;
  endAt: Date | null;
}

const initialState: BookingState = {
  step: 1,
  bookingType: null,
  date: null,
  hours: 3,
  startHour: null,
  roomId: null,
  roomName: null,
  price: null,
  guestName: "",
  guestPhone: "",
  guestEmail: "",
  note: "",
  startAt: null,
  endAt: null,
};

const STEP_COUNT = 5;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir < 0 ? 80 : -80,
    opacity: 0,
  }),
};

export default function BookingWizard() {
  const t = useTranslations("booking_wizard");
  const [state, setState] = useState<BookingState>(initialState);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingResult, setBookingResult] = useState<{ id: string } | null>(null);

  const goTo = useCallback(
    (step: number) => {
      setDirection(step > state.step ? 1 : -1);
      setState((s) => ({ ...s, step }));
    },
    [state.step]
  );

  const handleTypeSelect = useCallback(
    (type: BookingType) => {
      setState((s) => ({ ...s, bookingType: type, date: null, roomId: null, roomName: null, price: null, startAt: null, endAt: null }));
      goTo(2);
    },
    [goTo]
  );

  const handleDateSelect = useCallback(
    (date: Date, hours: number, startHour?: number) => {
      const result = calculateBookingSlot(state.bookingType!, date, hours, startHour);
      if (!result.valid) return;

      const isFf = state.bookingType === "fast_furious";
      const ffPrice = isFf ? getFastFuriousPrice(hours as FastFuriousHours) : null;

      setState((s) => ({
        ...s,
        date,
        hours,
        startHour: startHour ?? null,
        startAt: result.slot!.start_at,
        endAt: result.slot!.end_at,
        roomId: null,
        roomName: null,
        price: ffPrice,
      }));
      goTo(3);
    },
    [state.bookingType, goTo]
  );

  const handleRoomSelect = useCallback(
    (roomId: string, roomName: string, price: number) => {
      setState((s) => ({ ...s, roomId, roomName, price }));
      goTo(4);
    },
    [goTo]
  );

  const handleGuestSubmit = useCallback(
    (data: { guestName: string; guestPhone: string; guestEmail: string; note: string }) => {
      setState((s) => ({ ...s, ...data }));
      goTo(5);
    },
    [goTo]
  );

  const handleConfirm = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_type: state.bookingType,
          date: state.date?.toISOString(),
          hours: state.hours,
          start_hour: state.startHour,
          room_id: state.roomId,
          guest_name: state.guestName,
          guest_phone: state.guestPhone,
          guest_email: state.guestEmail || undefined,
          note: state.note || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data.error === "ROOM_NOT_AVAILABLE"
          ? "Phòng đã được đặt trong thời gian này. Vui lòng chọn phòng khác."
          : data.errors?.join(", ") || data.error || "Đặt phòng thất bại";
        throw new Error(msg);
      }

      setBookingResult({ id: data.id });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Đặt phòng thất bại. Vui lòng thử lại.");
      setSubmitting(false);
    }
  }, [state, submitting]);

  const stepLabels = [
    t("step_type"),
    t("step_date"),
    t("step_room"),
    t("step_guest"),
    t("step_confirm"),
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Stepper */}
      {!bookingResult && (
        <div className="flex items-center justify-center gap-2 mb-10">
          {stepLabels.map((label, i) => {
            const stepNum = i + 1;
            const isActive = stepNum === state.step;
            const isDone = stepNum < state.step;

            return (
              <div key={i} className="flex items-center gap-2">
                <button
                  onClick={() => isDone ? goTo(stepNum) : undefined}
                  disabled={!isDone}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-brown text-white"
                      : isDone
                        ? "bg-brown/10 text-brown cursor-pointer hover:bg-brown/20"
                        : "bg-cream-dark/50 text-text-muted"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current/20">
                    {isDone ? "✓" : stepNum}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
                {i < STEP_COUNT - 1 && (
                  <div className={`w-6 h-px ${isDone ? "bg-brown/30" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={bookingResult ? "result" : state.step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {bookingResult ? (
            <BookingConfirmation
              state={state}
              bookingId={bookingResult.id}
              onReset={() => {
                setState(initialState);
                setBookingResult(null);
                setSubmitting(false);
              }}
            />
          ) : (
            <>
              {state.step === 1 && (
                <BookingTypeSelector onSelect={handleTypeSelect} />
              )}
              {state.step === 2 && (
                <DateTimePicker
                  bookingType={state.bookingType!}
                  onSelect={handleDateSelect}
                  onBack={() => goTo(1)}
                />
              )}
              {state.step === 3 && (
                <RoomPicker
                  bookingType={state.bookingType!}
                  startAt={state.startAt!}
                  endAt={state.endAt!}
                  hours={state.hours}
                  onSelect={handleRoomSelect}
                  onBack={() => goTo(2)}
                />
              )}
              {state.step === 4 && (
                <GuestForm
                  onSubmit={handleGuestSubmit}
                  onBack={() => goTo(3)}
                  initialData={{
                    guestName: state.guestName,
                    guestPhone: state.guestPhone,
                    guestEmail: state.guestEmail,
                    note: state.note,
                  }}
                />
              )}
              {state.step === 5 && (
                <div className="bg-white rounded-2xl p-8 border border-border/40 shadow-sm">
                  <h3 className="text-xl font-semibold text-brown-dark mb-6">
                    {t("review_title")}
                  </h3>
                  <dl className="space-y-3 text-sm">
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
                    <div className="flex justify-between">
                      <dt className="text-text-muted">{t("step_guest")}</dt>
                      <dd className="font-medium text-brown-dark">{state.guestName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-text-muted">{t("phone")}</dt>
                      <dd className="font-medium text-brown-dark">{state.guestPhone}</dd>
                    </div>
                    {state.price && (
                      <div className="flex justify-between pt-3 border-t border-border/30">
                        <dt className="text-text-muted font-medium">{t("total")}</dt>
                        <dd className="text-lg font-bold text-brown">
                          {state.price.toLocaleString("vi-VN")}đ
                        </dd>
                      </div>
                    )}
                  </dl>

                  {submitError && (
                    <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl mt-4">{submitError}</p>
                  )}

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => goTo(4)}
                      className="flex-1 py-3 border border-border rounded-xl text-sm font-medium text-text-light hover:bg-cream transition-colors cursor-pointer"
                    >
                      {t("back")}
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={submitting}
                      className="flex-1 py-3 bg-green text-white rounded-xl text-sm font-semibold hover:bg-green-dark transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? t("submitting") : t("confirm")}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
