export type { Database } from "./database.types";
export type { Json } from "./database.types";

export type BookingType = "good_morning" | "midnight_hot" | "overnight" | "fast_furious";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  capacity_adults: number;
  capacity_children: number;
  beds: string;
  amenities: string[];
  images: string[];
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomPrice {
  id: string;
  room_id: string;
  booking_type: BookingType;
  price: number;
  created_at: string;
}

export interface Booking {
  id: string;
  room_id: string;
  booking_type: BookingType;
  start_at: string;
  end_at: string;
  guest_name: string;
  guest_phone: string;
  guest_email: string | null;
  note: string | null;
  status: BookingStatus;
  payment_info: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface RoomWithPrices extends Room {
  room_prices: RoomPrice[];
}
