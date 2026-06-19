import { sendTelegram } from "./telegram";
import { sendZaloOAByPhone } from "./zalo";
import {
  ownerNewBooking,
  ownerCancellation,
  ownerDailyReminder,
  guestConfirmation,
  guestReminder,
  guestCancelled,
  type BookingNotifyData,
} from "./templates";

export type { BookingNotifyData };

export async function notifyNewBooking(data: BookingNotifyData): Promise<void> {
  const ownerMsg = ownerNewBooking(data);
  const guestMsg = guestConfirmation(data);

  await Promise.allSettled([
    sendTelegram(ownerMsg),
    sendZaloOAByPhone(data.guestPhone, guestMsg),
    data.guestPhone
      ? sendTelegram(guestMsg, process.env.TELEGRAM_GUEST_CHAT_ID)
      : Promise.resolve(),
  ]);
}

export async function notifyCancellation(data: BookingNotifyData): Promise<void> {
  const ownerMsg = ownerCancellation(data);
  const guestMsg = guestCancelled(data);

  await Promise.allSettled([
    sendTelegram(ownerMsg),
    sendZaloOAByPhone(data.guestPhone, guestMsg),
  ]);
}

export async function notifyDailyReminder(
  date: string,
  bookings: BookingNotifyData[]
): Promise<void> {
  if (bookings.length === 0) return;

  const ownerMsg = ownerDailyReminder(date, bookings);
  await sendTelegram(ownerMsg);

  await Promise.allSettled(
    bookings.map((b) => {
      const msg = guestReminder(b);
      return sendZaloOAByPhone(b.guestPhone, msg);
    })
  );
}
