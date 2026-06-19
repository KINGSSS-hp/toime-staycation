import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { booking_id, status } = body;

  if (!booking_id || !["confirmed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", booking_id)
      .select("id, status")
      .single();

    if (error) {
      console.error("[Admin Bookings] Update error:", error);
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({ booking: data });
  } catch (err) {
    console.error("[Admin Bookings] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
