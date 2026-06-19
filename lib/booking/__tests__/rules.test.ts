import { describe, it, expect } from "vitest";
import { calculateBookingSlot, hasTimeOverlap, getFastFuriousPrice } from "../rules";

function makeDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

const MONDAY = makeDate(2025, 1, 6);
const SUNDAY = makeDate(2025, 1, 5);
const SATURDAY = makeDate(2025, 1, 4);
const FRIDAY = makeDate(2025, 1, 3);

describe("Good Morning", () => {
  it("trả về 09:00–18:00 cùng ngày cho ngày thường", () => {
    const result = calculateBookingSlot("good_morning", MONDAY);
    expect(result.valid).toBe(true);
    expect(result.slot!.start_at.getHours()).toBe(9);
    expect(result.slot!.end_at.getHours()).toBe(18);
    expect(result.slot!.start_at.getDate()).toBe(result.slot!.end_at.getDate());
  });

  it("chặn Chủ Nhật", () => {
    const result = calculateBookingSlot("good_morning", SUNDAY);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("SUNDAY_NOT_ALLOWED");
  });

  it("cho phép Thứ Bảy", () => {
    expect(calculateBookingSlot("good_morning", SATURDAY).valid).toBe(true);
  });

  it("cho phép Thứ Sáu", () => {
    expect(calculateBookingSlot("good_morning", FRIDAY).valid).toBe(true);
  });
});

describe("Midnight Hot", () => {
  it("trả về 21:00 → 12:00 hôm sau", () => {
    const result = calculateBookingSlot("midnight_hot", MONDAY);
    expect(result.valid).toBe(true);
    expect(result.slot!.start_at.getHours()).toBe(21);
    expect(result.slot!.end_at.getHours()).toBe(12);
    expect(result.slot!.end_at.getDate()).toBe(MONDAY.getDate() + 1);
  });

  it("cho phép Chủ Nhật", () => {
    expect(calculateBookingSlot("midnight_hot", SUNDAY).valid).toBe(true);
  });
});

describe("Overnight", () => {
  it("trả về 14:00 → 12:00 hôm sau", () => {
    const result = calculateBookingSlot("overnight", MONDAY);
    expect(result.valid).toBe(true);
    expect(result.slot!.start_at.getHours()).toBe(14);
    expect(result.slot!.end_at.getHours()).toBe(12);
    expect(result.slot!.end_at.getDate()).toBe(MONDAY.getDate() + 1);
  });

  it("start_at và end_at cách nhau 22 giờ", () => {
    const result = calculateBookingSlot("overnight", MONDAY);
    const diff = result.slot!.end_at.getTime() - result.slot!.start_at.getTime();
    expect(diff).toBe(22 * 60 * 60 * 1000);
  });
});

describe("Fast & Furious", () => {
  it("3 tiếng: 10:00 → 13:00", () => {
    const result = calculateBookingSlot("fast_furious", MONDAY, 3, 10);
    expect(result.valid).toBe(true);
    expect(result.slot!.start_at.getHours()).toBe(10);
    expect(result.slot!.end_at.getHours()).toBe(13);
  });

  it("4 tiếng: 14:00 → 18:00", () => {
    const result = calculateBookingSlot("fast_furious", MONDAY, 4, 14);
    expect(result.valid).toBe(true);
    expect(result.slot!.start_at.getHours()).toBe(14);
    expect(result.slot!.end_at.getHours()).toBe(18);
  });

  it("5 tiếng: 9:00 → 14:00", () => {
    const result = calculateBookingSlot("fast_furious", MONDAY, 5, 9);
    expect(result.valid).toBe(true);
    expect(result.slot!.start_at.getHours()).toBe(9);
    expect(result.slot!.end_at.getHours()).toBe(14);
  });

  it("từ chối duration không hợp lệ (2 tiếng)", () => {
    const result = calculateBookingSlot("fast_furious", MONDAY, 2, 10);
    expect(result.valid).toBe(false);
    expect(result.error).toBe("INVALID_DURATION");
  });

  it("cho phép giờ 0:00 (nửa đêm)", () => {
    const result = calculateBookingSlot("fast_furious", MONDAY, 3, 0);
    expect(result.valid).toBe(true);
    expect(result.slot!.start_at.getHours()).toBe(0);
    expect(result.slot!.end_at.getHours()).toBe(3);
  });

  it("cho phép giờ 24:00 (= 0:00 ngày hôm sau)", () => {
    const result = calculateBookingSlot("fast_furious", MONDAY, 3, 24);
    expect(result.valid).toBe(true);
    expect(result.slot!.start_at.getHours()).toBe(0);
    expect(result.slot!.start_at.getDate()).toBe(MONDAY.getDate() + 1);
    expect(result.slot!.end_at.getHours()).toBe(3);
  });

  it("21:00 + 5h = 02:00 ngày hôm sau", () => {
    const result = calculateBookingSlot("fast_furious", MONDAY, 5, 21);
    expect(result.valid).toBe(true);
    expect(result.slot!.start_at.getHours()).toBe(21);
    expect(result.slot!.end_at.getHours()).toBe(2);
    expect(result.slot!.end_at.getDate()).toBe(MONDAY.getDate() + 1);
  });

  it("giá đúng theo duration", () => {
    expect(getFastFuriousPrice(3)).toBe(399000);
    expect(getFastFuriousPrice(4)).toBe(499000);
    expect(getFastFuriousPrice(5)).toBe(549000);
  });
});

describe("hasTimeOverlap", () => {
  it("phát hiện overlap hoàn toàn", () => {
    const a = { start_at: new Date("2025-01-06T09:00"), end_at: new Date("2025-01-06T18:00") };
    const b = { start_at: new Date("2025-01-06T10:00"), end_at: new Date("2025-01-06T15:00") };
    expect(hasTimeOverlap(a, b)).toBe(true);
  });

  it("phát hiện overlap một phần", () => {
    const a = { start_at: new Date("2025-01-06T09:00"), end_at: new Date("2025-01-06T18:00") };
    const b = { start_at: new Date("2025-01-06T15:00"), end_at: new Date("2025-01-06T22:00") };
    expect(hasTimeOverlap(a, b)).toBe(true);
  });

  it("không overlap khi kế tiếp nhau", () => {
    const gm = { start_at: new Date("2025-01-06T09:00"), end_at: new Date("2025-01-06T18:00") };
    const mh = { start_at: new Date("2025-01-06T21:00"), end_at: new Date("2025-01-07T12:00") };
    expect(hasTimeOverlap(gm, mh)).toBe(false);
  });

  it("không overlap khi end === start (biên giờ)", () => {
    const a = { start_at: new Date("2025-01-06T09:00"), end_at: new Date("2025-01-06T18:00") };
    const b = { start_at: new Date("2025-01-06T18:00"), end_at: new Date("2025-01-06T22:00") };
    expect(hasTimeOverlap(a, b)).toBe(false);
  });

  it("Fast & Furious 3h overlap với Good Morning cùng ngày", () => {
    const ff = { start_at: new Date("2025-01-06T10:00"), end_at: new Date("2025-01-06T13:00") };
    const gm = { start_at: new Date("2025-01-06T09:00"), end_at: new Date("2025-01-06T18:00") };
    expect(hasTimeOverlap(ff, gm)).toBe(true);
  });

  it("Fast & Furious 3h không overlap với Midnight Hot", () => {
    const ff = { start_at: new Date("2025-01-06T10:00"), end_at: new Date("2025-01-06T13:00") };
    const mh = { start_at: new Date("2025-01-06T21:00"), end_at: new Date("2025-01-07T12:00") };
    expect(hasTimeOverlap(ff, mh)).toBe(false);
  });
});
