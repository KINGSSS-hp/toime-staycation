import { calculateBookingSlot } from "./rules";
import type { BookingType } from "@/lib/supabase/types";

export interface BookingInput {
  booking_type: BookingType;
  date: string;
  hours?: number;
  start_hour?: number;
  room_id: string;
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  note?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const PHONE_REGEX = /^(\+84|0)\d{9,10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_BOOKING_TYPES: BookingType[] = [
  "good_morning",
  "midnight_hot",
  "overnight",
  "fast_furious",
];

export function validateBookingInput(input: BookingInput): ValidationResult {
  const errors: string[] = [];

  if (!VALID_BOOKING_TYPES.includes(input.booking_type)) {
    errors.push("INVALID_BOOKING_TYPE");
  }

  if (!input.date || isNaN(Date.parse(input.date))) {
    errors.push("INVALID_DATE");
  }

  if (!input.room_id) {
    errors.push("ROOM_REQUIRED");
  }

  if (!input.guest_name || input.guest_name.trim().length < 2) {
    errors.push("NAME_REQUIRED");
  }

  if (!input.guest_phone || !PHONE_REGEX.test(input.guest_phone)) {
    errors.push("INVALID_PHONE");
  }

  if (input.guest_email && !EMAIL_REGEX.test(input.guest_email)) {
    errors.push("INVALID_EMAIL");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const date = new Date(input.date);
  const slotResult = calculateBookingSlot(
    input.booking_type,
    date,
    input.hours,
    input.start_hour
  );

  if (!slotResult.valid) {
    errors.push(slotResult.error!);
  }

  const now = new Date();
  if (slotResult.slot && slotResult.slot.start_at <= now) {
    errors.push("DATE_IN_PAST");
  }

  return { valid: errors.length === 0, errors };
}
