import { NextRequest, NextResponse } from "next/server";
import { validateBookingInput } from "@/lib/booking/validation";
import { calculateBookingSlot } from "@/lib/booking/rules";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { notifyNewBooking } from "@/lib/notify";
import type { BookingType } from "@/lib/supabase/types";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = validateBookingInput({
    booking_type: body.booking_type,
    date: body.date,
    hours: body.hours,
    start_hour: body.start_hour,
    room_id: body.room_id,
    guest_name: body.guest_name,
    guest_phone: body.guest_phone,
    guest_email: body.guest_email,
    note: body.note,
  });

  if (!validation.valid) {
    return NextResponse.json(
      { error: "Validation failed", errors: validation.errors },
      { status: 400 }
    );
  }

  const date = new Date(body.date);
  const slot = calculateBookingSlot(
    body.booking_type as BookingType,
    date,
    body.hours,
    body.start_hour
  );

  if (!slot.valid) {
    return NextResponse.json({ error: slot.error }, { status: 400 });
  }

  const startAt = slot.slot!.start_at.toISOString();
  const endAt = slot.slot!.end_at.toISOString();

  try {
    const supabase = await createServiceRoleClient();

    // Check room availability (overlap)
    const { data: isAvailable, error: rpcError } = await supabase.rpc("check_room_available", {
      p_room_id: body.room_id,
      p_start_at: startAt,
      p_end_at: endAt,
    });

    if (rpcError) {
      console.error("[Booking] RPC error:", rpcError);
      return NextResponse.json(
        { error: "Failed to check availability" },
        { status: 500 }
      );
    }

    if (isAvailable === false) {
      return NextResponse.json(
        { error: "ROOM_NOT_AVAILABLE" },
        { status: 409 }
      );
    }

    // Insert booking
    const { data: booking, error: insertError } = await supabase
      .from("bookings")
      .insert({
        room_id: body.room_id,
        booking_type: body.booking_type,
        start_at: startAt,
        end_at: endAt,
        guest_name: body.guest_name,
        guest_phone: body.guest_phone,
        guest_email: body.guest_email || null,
        note: body.note || null,
      })
      .select("id, status")
      .single();

    if (insertError) {
      console.error("[Booking] Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    // Get room name for notification
    const { data: room } = await supabase
      .from("rooms")
      .select("name")
      .eq("id", body.room_id)
      .single();

    // Get price for notification
    const { data: priceData } = await supabase
      .from("room_prices")
      .select("price")
      .eq("room_id", body.room_id)
      .eq("booking_type", body.booking_type)
      .single();

    // Send notifications (non-blocking)
    notifyNewBooking({
      bookingId: booking.id,
      guestName: body.guest_name,
      guestPhone: body.guest_phone,
      guestEmail: body.guest_email,
      bookingType: body.booking_type,
      roomName: room?.name || "Phòng",
      startAt,
      endAt,
      note: body.note,
      status: booking.status,
      price: priceData?.price,
      hours: body.hours,
    }).catch((err) => console.error("[Booking] Notify error:", err));

    return NextResponse.json({
      id: booking.id,
      status: booking.status,
      start_at: startAt,
      end_at: endAt,
    });
  } catch (err) {
    console.error("[Booking] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
