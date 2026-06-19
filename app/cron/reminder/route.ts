import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { notifyDailyReminder, type BookingNotifyData } from "@/lib/notify";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createServiceRoleClient();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStart = new Date(tomorrow);
    tomorrowStart.setHours(0, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    // Query bookings checking in tomorrow
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        id, booking_type, start_at, end_at,
        guest_name, guest_phone, guest_email, note, status,
        rooms (name)
      `)
      .in("status", ["pending", "confirmed"])
      .gte("start_at", tomorrowStart.toISOString())
      .lte("start_at", tomorrowEnd.toISOString());

    if (error) {
      console.error("[Cron] Query error:", error);
      return NextResponse.json({ error: "Query failed" }, { status: 500 });
    }

    const notifyData: BookingNotifyData[] = (bookings || []).map((b) => ({
      bookingId: b.id,
      guestName: b.guest_name,
      guestPhone: b.guest_phone,
      guestEmail: b.guest_email || undefined,
      bookingType: b.booking_type,
      roomName: (b.rooms as { name: string } | null)?.name || "Phòng",
      startAt: b.start_at,
      endAt: b.end_at,
      note: b.note || undefined,
      status: b.status,
    }));

    if (notifyData.length > 0) {
      await notifyDailyReminder(tomorrowStr, notifyData);
    }

    return NextResponse.json({
      ok: true,
      date: tomorrowStr,
      reminders_sent: notifyData.length,
    });
  } catch (err) {
    console.error("[Cron Reminder] Error:", err);
    return NextResponse.json({ error: "Reminder failed" }, { status: 500 });
  }
}
