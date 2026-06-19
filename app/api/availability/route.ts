import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { BookingType } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const bookingType = searchParams.get("booking_type") as BookingType;
  const startAt = searchParams.get("start_at");
  const endAt = searchParams.get("end_at");

  if (!bookingType) {
    return NextResponse.json({ error: "booking_type required" }, { status: 400 });
  }

  try {
    const supabase = await createServiceRoleClient();

    // 1. Get active rooms
    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select("id, name, slug, description, beds, capacity_adults, capacity_children, amenities, images")
      .eq("active", true)
      .order("sort_order");

    if (roomsError || !rooms) {
      console.error("[Availability] Rooms query error:", roomsError);
      return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
    }

    // 2. Get prices for this booking type
    const { data: prices } = await supabase
      .from("room_prices")
      .select("room_id, price")
      .eq("booking_type", bookingType);

    const priceMap = new Map(
      (prices || []).map((p) => [p.room_id, p.price])
    );

    // 3. Check overlap if time range provided
    let unavailableRoomIds = new Set<string>();

    if (startAt && endAt) {
      const { data: conflicting } = await supabase
        .from("bookings")
        .select("room_id")
        .in("status", ["pending", "confirmed"])
        .lt("start_at", endAt)
        .gt("end_at", startAt);

      if (conflicting) {
        for (const b of conflicting) {
          unavailableRoomIds.add(b.room_id);
        }
      }
    }

    // 4. Combine
    const availableRooms = rooms
      .filter((r) => !unavailableRoomIds.has(r.id) && priceMap.has(r.id))
      .map((r) => ({
        id: r.id,
        name: r.name,
        beds: r.beds,
        capacity: `${r.capacity_adults} người lớn` +
          (r.capacity_children > 0 ? ` + ${r.capacity_children} trẻ em` : ""),
        amenities: r.amenities || [],
        image: (r.images as string[] | null)?.[0] || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
        price: priceMap.get(r.id) || 0,
      }));

    return NextResponse.json({ rooms: availableRooms });
  } catch (err) {
    console.error("[Availability] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
