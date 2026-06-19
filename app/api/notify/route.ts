import { NextRequest, NextResponse } from "next/server";
import { notifyNewBooking, notifyCancellation, type BookingNotifyData } from "@/lib/notify";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, data } = body as { type: string; data: BookingNotifyData };

  if (!type || !data) {
    return NextResponse.json(
      { error: "Missing type or data" },
      { status: 400 }
    );
  }

  try {
    switch (type) {
      case "new_booking":
        await notifyNewBooking(data);
        break;
      case "cancellation":
        await notifyCancellation(data);
        break;
      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Notify API] Error:", err);
    return NextResponse.json(
      { error: "Notification failed" },
      { status: 500 }
    );
  }
}
