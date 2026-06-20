import type { BookingType } from "@/lib/supabase/types";

export interface BookingTimeSlot {
  start_at: Date;
  end_at: Date;
}

export interface BookingRuleResult {
  valid: boolean;
  slot?: BookingTimeSlot;
  error?: string;
}

export const FAST_FURIOUS_OPTIONS = [
  { hours: 3, price: 399000, label: "3 tiếng" },
  { hours: 4, price: 499000, label: "4 tiếng" },
  { hours: 5, price: 549000, label: "5 tiếng" },
] as const;

export const FAST_FURIOUS_PREMIUM = [
  { hours: 3, price: 449000, label: "3 tiếng" },
  { hours: 4, price: 549000, label: "4 tiếng" },
  { hours: 5, price: 649000, label: "5 tiếng" },
] as const;

export const FF_PREMIUM_ROOM_IDS = [
  "11111111-1111-1111-1111-111111111104",
  "11111111-1111-1111-1111-111111111107",
];

export type FastFuriousHours = 3 | 4 | 5;

export function getFastFuriousPrice(hours: FastFuriousHours, roomId?: string): number {
  const isPremium = roomId && FF_PREMIUM_ROOM_IDS.includes(roomId);
  const options = isPremium ? FAST_FURIOUS_PREMIUM : FAST_FURIOUS_OPTIONS;
  const opt = options.find((o) => o.hours === hours);
  return opt?.price ?? 0;
}

export function getFastFuriousOptions(roomId?: string) {
  const isPremium = roomId && FF_PREMIUM_ROOM_IDS.includes(roomId);
  return isPremium ? FAST_FURIOUS_PREMIUM : FAST_FURIOUS_OPTIONS;
}

function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

function setTime(date: Date, hours: number, minutes: number = 0): Date {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

/**
 * Good Morning: 09:00–18:00 cùng ngày. KHÔNG nhận Chủ Nhật.
 */
function calcGoodMorning(date: Date): BookingRuleResult {
  if (isSunday(date)) {
    return { valid: false, error: "SUNDAY_NOT_ALLOWED" };
  }

  return {
    valid: true,
    slot: {
      start_at: setTime(date, 9),
      end_at: setTime(date, 18),
    },
  };
}

/**
 * Midnight Hot: 21:00 → tối đa 12:00 ngày hôm sau.
 */
function calcMidnightHot(date: Date): BookingRuleResult {
  return {
    valid: true,
    slot: {
      start_at: setTime(date, 21),
      end_at: setTime(addDays(date, 1), 12),
    },
  };
}

/**
 * Overnight: check-in 14:00 / check-out 12:00 hôm sau.
 */
function calcOvernight(date: Date): BookingRuleResult {
  return {
    valid: true,
    slot: {
      start_at: setTime(date, 14),
      end_at: setTime(addDays(date, 1), 12),
    },
  };
}

/**
 * Multi-night: nhiều đêm liên tiếp, check-in 14:00 / check-out 12:00.
 */
function calcMultiNight(date: Date, nights: number): BookingRuleResult {
  if (!nights || nights < 2 || nights > 30) {
    return { valid: false, error: "INVALID_NIGHTS" };
  }

  return {
    valid: true,
    slot: {
      start_at: setTime(date, 14),
      end_at: setTime(addDays(date, nights), 12),
    },
  };
}

/**
 * Fast & Furious: chọn 3/4/5 tiếng, chọn giờ bắt đầu.
 * @param date ngày đặt
 * @param hours số tiếng (3, 4, hoặc 5)
 * @param startHour giờ bắt đầu (0–24, hỗ trợ qua đêm)
 */
function calcFastFurious(
  date: Date,
  hours: number,
  startHour: number
): BookingRuleResult {
  if (![3, 4, 5].includes(hours)) {
    return { valid: false, error: "INVALID_DURATION" };
  }

  if (startHour < 0 || startHour > 24) {
    return { valid: false, error: "INVALID_START_HOUR" };
  }

  const actualHour = startHour === 24 ? 0 : startHour;
  const startDate = startHour === 24 ? addDays(date, 1) : date;
  const startAt = setTime(startDate, actualHour);
  const endAt = addHours(startAt, hours);

  return {
    valid: true,
    slot: { start_at: startAt, end_at: endAt },
  };
}

export function calculateBookingSlot(
  bookingType: BookingType,
  date: Date,
  hoursOrNights?: number,
  startHour?: number
): BookingRuleResult {
  switch (bookingType) {
    case "good_morning":
      return calcGoodMorning(date);
    case "midnight_hot":
      return calcMidnightHot(date);
    case "overnight":
      return calcOvernight(date);
    case "multi_night":
      return calcMultiNight(date, hoursOrNights ?? 0);
    case "fast_furious":
      return calcFastFurious(date, hoursOrNights ?? 0, startHour ?? 0);
    default: {
      const _exhaustive: never = bookingType;
      return { valid: false, error: `UNKNOWN_TYPE: ${_exhaustive}` };
    }
  }
}

export function hasTimeOverlap(
  a: BookingTimeSlot,
  b: BookingTimeSlot
): boolean {
  return a.start_at < b.end_at && a.end_at > b.start_at;
}

export const BOOKING_TYPE_LABELS: Record<BookingType, { vi: string; en: string }> = {
  good_morning: { vi: "Good Morning", en: "Good Morning" },
  midnight_hot: { vi: "Midnight Hot", en: "Midnight Hot" },
  overnight: { vi: "Chill All Day", en: "Chill All Day" },
  multi_night: { vi: "Multi-night", en: "Multi-night" },
  fast_furious: { vi: "Fast & Furious", en: "Fast & Furious" },
};
