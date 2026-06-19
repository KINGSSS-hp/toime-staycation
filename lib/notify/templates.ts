import type { BookingType, BookingStatus } from "@/lib/supabase/types";
import { FAST_FURIOUS_OPTIONS, type FastFuriousHours } from "@/lib/booking/rules";

const TYPE_LABELS: Record<BookingType, string> = {
  good_morning: "Good Morning (09:00–18:00)",
  midnight_hot: "Midnight Hot (21:00–12:00)",
  overnight: "Chill All Day (14:00–12:00)",
  fast_furious: "Fast & Furious",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Chờ thanh toán",
  confirmed: "Đã xác nhận",
  cancelled: "Đã huỷ",
  completed: "Hoàn thành",
};

export interface BookingNotifyData {
  bookingId: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  bookingType: BookingType;
  roomName: string;
  startAt: string;
  endAt: string;
  note?: string;
  status: BookingStatus;
  price?: number;
  hours?: number;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "đ";
}

function ffLabel(hours?: number): string {
  if (!hours) return "Fast & Furious";
  const opt = FAST_FURIOUS_OPTIONS.find((o) => o.hours === hours);
  return `Fast & Furious — ${hours} tiếng (${opt ? formatPrice(opt.price) : ""})`;
}

// ============================================================
// Tin nhắn cho CHỦ HOMESTAY — khi có booking mới
// ============================================================
export function ownerNewBooking(data: BookingNotifyData): string {
  const isFf = data.bookingType === "fast_furious";

  let msg = `🏠 <b>BOOKING MỚI</b>\n`;
  msg += `━━━━━━━━━━━━━━━\n`;
  msg += `👤 <b>${data.guestName}</b>\n`;
  msg += `📱 ${data.guestPhone}\n`;
  if (data.guestEmail) msg += `📧 ${data.guestEmail}\n`;
  msg += `\n`;

  if (isFf) {
    msg += `📋 Loại: <b>${ffLabel(data.hours)}</b>\n`;
  } else {
    msg += `📋 Loại: <b>${TYPE_LABELS[data.bookingType]}</b>\n`;
  }

  msg += `🛏 Phòng: <b>${data.roomName}</b>\n`;
  msg += `📅 Check-in: ${formatDateTime(data.startAt)}\n`;
  msg += `📅 Check-out: ${formatDateTime(data.endAt)}\n`;

  if (data.price) {
    msg += `💰 Tổng: <b>${formatPrice(data.price)}</b>\n`;
  }
  msg += `\n`;
  msg += `💳 Thanh toán: ${STATUS_LABELS[data.status]}\n`;
  if (data.note) msg += `📝 Ghi chú: ${data.note}\n`;
  msg += `\n🔖 ID: ${data.bookingId.slice(0, 8).toUpperCase()}`;

  return msg;
}

// ============================================================
// Tin nhắn cho CHỦ — khi khách huỷ booking
// ============================================================
export function ownerCancellation(data: BookingNotifyData): string {
  const isFf = data.bookingType === "fast_furious";
  const typeStr = isFf ? ffLabel(data.hours) : TYPE_LABELS[data.bookingType];

  let msg = `❌ <b>BOOKING ĐÃ HUỶ</b>\n`;
  msg += `━━━━━━━━━━━━━━━\n`;
  msg += `👤 ${data.guestName} (${data.guestPhone})\n`;
  msg += `🛏 ${data.roomName} — ${typeStr}\n`;
  msg += `📅 ${formatDateTime(data.startAt)} → ${formatDateTime(data.endAt)}\n`;
  msg += `🔖 ID: ${data.bookingId.slice(0, 8).toUpperCase()}`;

  return msg;
}

// ============================================================
// Tin nhắn cho CHỦ — reminder tổng hợp check-in ngày mai
// ============================================================
export function ownerDailyReminder(
  date: string,
  bookings: BookingNotifyData[]
): string {
  let msg = `📋 <b>CHECK-IN NGÀY MAI</b> (${date})\n`;
  msg += `━━━━━━━━━━━━━━━\n`;
  msg += `Tổng: <b>${bookings.length} booking</b>\n\n`;

  bookings.forEach((b, i) => {
    const isFf = b.bookingType === "fast_furious";
    const typeStr = isFf ? `F&F ${b.hours}h` : TYPE_LABELS[b.bookingType].split(" (")[0];

    msg += `${i + 1}. <b>${b.guestName}</b> — ${b.roomName}\n`;
    msg += `   📱 ${b.guestPhone} · ${typeStr}\n`;
    msg += `   📅 ${formatDateTime(b.startAt)}`;
    if (isFf && b.price) msg += ` · ${formatPrice(b.price)}`;
    msg += `\n`;
    if (b.note) msg += `   📝 ${b.note}\n`;
    msg += `\n`;
  });

  return msg.trim();
}

// ============================================================
// Tin nhắn cho KHÁCH — xác nhận đặt phòng thành công
// ============================================================
export function guestConfirmation(data: BookingNotifyData): string {
  const bankName = process.env.NEXT_PUBLIC_BANK_NAME || "Vietcombank";
  const bankAccount = process.env.NEXT_PUBLIC_BANK_ACCOUNT || "1234567890";
  const bankHolder = process.env.NEXT_PUBLIC_BANK_HOLDER || "NGUYEN VAN A";
  const isFf = data.bookingType === "fast_furious";

  let msg = `✅ <b>ĐẶT PHÒNG THÀNH CÔNG</b>\n`;
  msg += `━━━━━━━━━━━━━━━\n`;
  msg += `Xin chào <b>${data.guestName}</b>!\n\n`;
  msg += `🛏 Phòng: <b>${data.roomName}</b>\n`;

  if (isFf) {
    msg += `📋 Gói: <b>${ffLabel(data.hours)}</b>\n`;
  } else {
    msg += `📋 Loại: ${TYPE_LABELS[data.bookingType]}\n`;
  }

  msg += `📅 Check-in: ${formatDateTime(data.startAt)}\n`;
  msg += `📅 Check-out: ${formatDateTime(data.endAt)}\n`;

  if (data.price) {
    msg += `💰 Tổng: <b>${formatPrice(data.price)}</b>\n`;
  }

  msg += `\n`;
  msg += `💳 <b>Thông tin chuyển khoản:</b>\n`;
  msg += `Ngân hàng: ${bankName}\n`;
  msg += `STK: ${bankAccount}\n`;
  msg += `Chủ TK: ${bankHolder}\n`;
  msg += `Nội dung: TOIME ${data.bookingId.slice(0, 8).toUpperCase()}\n`;
  msg += `\nCảm ơn bạn đã chọn ToiME Staycation! 🏡`;

  return msg;
}

// ============================================================
// Tin nhắn cho KHÁCH — nhắc trước 1 ngày
// ============================================================
export function guestReminder(data: BookingNotifyData): string {
  const isFf = data.bookingType === "fast_furious";

  let msg = `🔔 <b>NHẮC LỊCH CHECK-IN</b>\n`;
  msg += `━━━━━━━━━━━━━━━\n`;
  msg += `Xin chào <b>${data.guestName}</b>!\n\n`;
  msg += `Ngày mai bạn sẽ check-in tại ToiME Staycation:\n`;
  msg += `🛏 Phòng: <b>${data.roomName}</b>\n`;

  if (isFf && data.hours) {
    msg += `📋 Gói: ${ffLabel(data.hours)}\n`;
  }

  msg += `📅 Check-in: ${formatDateTime(data.startAt)}\n`;
  msg += `\nHẹn gặp bạn! 🏡`;

  return msg;
}

// ============================================================
// Tin nhắn cho KHÁCH — khi bị huỷ phòng
// ============================================================
export function guestCancelled(data: BookingNotifyData): string {
  const isFf = data.bookingType === "fast_furious";
  const typeStr = isFf ? ffLabel(data.hours) : TYPE_LABELS[data.bookingType];

  let msg = `❌ <b>BOOKING ĐÃ HUỶ</b>\n`;
  msg += `━━━━━━━━━━━━━━━\n`;
  msg += `Xin chào ${data.guestName},\n\n`;
  msg += `Booking của bạn tại ToiME Staycation đã được huỷ:\n`;
  msg += `🛏 ${data.roomName} — ${typeStr}\n`;
  msg += `📅 ${formatDateTime(data.startAt)} → ${formatDateTime(data.endAt)}\n`;
  msg += `\nNếu cần hỗ trợ, vui lòng liên hệ chúng tôi.`;

  return msg;
}
