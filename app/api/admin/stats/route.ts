import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const now = new Date();
  const m = month ? parseInt(month) - 1 : now.getMonth();
  const y = year ? parseInt(year) : now.getFullYear();

  const startOfMonth = new Date(y, m, 1).toISOString();
  const endOfMonth = new Date(y, m + 1, 0, 23, 59, 59).toISOString();

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

  try {
    const supabase = await createServiceRoleClient();

    const [
      { data: allBookings },
      { data: todayBookings },
      { data: rooms },
      { data: prices },
    ] = await Promise.all([
      supabase
        .from("bookings")
        .select("id, room_id, booking_type, start_at, end_at, guest_name, guest_phone, guest_email, note, status, created_at")
        .gte("created_at", startOfMonth)
        .lte("created_at", endOfMonth)
        .order("created_at", { ascending: false }),
      supabase
        .from("bookings")
        .select("id, room_id, booking_type, start_at, end_at, guest_name, status")
        .gte("start_at", todayStart)
        .lte("start_at", todayEnd),
      supabase
        .from("rooms")
        .select("id, name")
        .eq("active", true)
        .order("sort_order"),
      supabase
        .from("room_prices")
        .select("room_id, booking_type, price"),
    ]);

    const roomMap = new Map((rooms || []).map((r) => [r.id, r.name]));
    const priceMap = new Map(
      (prices || []).map((p) => [`${p.room_id}_${p.booking_type}`, p.price])
    );

    const bookingsWithDetails = (allBookings || []).map((b) => ({
      ...b,
      room_name: roomMap.get(b.room_id) || "—",
      price: priceMap.get(`${b.room_id}_${b.booking_type}`) || 0,
    }));

    const confirmed = bookingsWithDetails.filter((b) => b.status === "confirmed");
    const totalRevenue = confirmed.reduce((sum, b) => sum + b.price, 0);

    const activeNow = (allBookings || []).filter((b) => {
      const start = new Date(b.start_at);
      const end = new Date(b.end_at);
      return now >= start && now <= end && b.status !== "cancelled";
    });

    const revenueByType: Record<string, number> = {};
    confirmed.forEach((b) => {
      revenueByType[b.booking_type] = (revenueByType[b.booking_type] || 0) + b.price;
    });

    const revenueByDay: Record<string, number> = {};
    confirmed.forEach((b) => {
      const day = b.created_at.split("T")[0];
      revenueByDay[day] = (revenueByDay[day] || 0) + b.price;
    });

    return NextResponse.json({
      summary: {
        totalBookings: bookingsWithDetails.length,
        confirmedBookings: confirmed.length,
        pendingBookings: bookingsWithDetails.filter((b) => b.status === "pending").length,
        cancelledBookings: bookingsWithDetails.filter((b) => b.status === "cancelled").length,
        totalRevenue,
        todayBookings: (todayBookings || []).length,
        activeRooms: activeNow.length,
        totalRooms: (rooms || []).length,
      },
      bookings: bookingsWithDetails,
      rooms: (rooms || []).map((r) => ({ id: r.id, name: r.name })),
      revenueByType,
      revenueByDay,
    });
  } catch (err) {
    console.error("[Admin Stats] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
