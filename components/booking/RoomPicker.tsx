"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { BookingType } from "@/lib/supabase/types";
import { getFastFuriousPrice, type FastFuriousHours } from "@/lib/booking/rules";

interface AvailableRoom {
  id: string;
  name: string;
  beds: string;
  capacity: string;
  amenities: string[];
  image: string;
  price: number;
}

interface Props {
  bookingType: BookingType;
  startAt: Date;
  endAt: Date;
  hours?: number;
  onSelect: (roomId: string, roomName: string, price: number) => void;
  onBack: () => void;
}

export default function RoomPicker({ bookingType, startAt, endAt, hours, onSelect, onBack }: Props) {
  const t = useTranslations("booking_wizard");
  const initialRooms = FALLBACK_ROOMS.map((r) => ({
    ...r,
    price: r.prices[bookingType],
  }));
  const [rooms, setRooms] = useState<AvailableRoom[]>(initialRooms);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRooms() {
      try {
        const params = new URLSearchParams({
          booking_type: bookingType,
          start_at: startAt.toISOString(),
          end_at: endAt.toISOString(),
        });

        const res = await fetch(`/api/availability?${params}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch");

        setRooms(data.rooms);
      } catch {
        // Fallback data already shown
      }
    }

    fetchRooms();
  }, [bookingType, startAt, endAt]);

  return (
    <div>
      <h3 className="text-xl font-semibold text-brown-dark mb-2">
        {t("select_room")}
      </h3>
      <p className="text-sm text-text-muted mb-6">
        {t("available_rooms_desc")}
      </p>

      {rooms.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-border/40 text-center">
          <p className="text-text-muted">{t("no_rooms")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...rooms].sort((a, b) => {
            const priceA = bookingType === "fast_furious" && hours ? getFastFuriousPrice(hours as FastFuriousHours, a.id) : a.price;
            const priceB = bookingType === "fast_furious" && hours ? getFastFuriousPrice(hours as FastFuriousHours, b.id) : b.price;
            return priceA - priceB;
          }).map((room) => (
            <button
              key={room.id}
              onClick={() => {
                const isFf = bookingType === "fast_furious" && hours;
                const isMn = bookingType === "multi_night" && hours;
                const actualPrice = isFf
                  ? getFastFuriousPrice(hours as FastFuriousHours, room.id)
                  : isMn ? room.price * hours
                  : room.price;
                onSelect(room.id, room.name, actualPrice);
              }}
              className="w-full text-left bg-white rounded-2xl p-5 border border-border/40 hover:border-brown/30 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex gap-4">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-24 h-20 rounded-xl object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-base font-semibold text-brown-dark group-hover:text-brown transition-colors">
                      {room.name}
                    </h4>
                    <p className="text-base font-bold text-brown flex-shrink-0">
                      {(bookingType === "fast_furious" && hours
                        ? getFastFuriousPrice(hours as FastFuriousHours, room.id)
                        : bookingType === "multi_night" && hours
                          ? room.price * hours
                          : room.price
                      ).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {room.amenities.map((a) => (
                      <span
                        key={a}
                        className="text-[11px] px-2 py-0.5 bg-cream rounded-full text-text-muted"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-green mt-1.5">🎁 Tặng kèm 2 nước suối & 2 mỳ ly</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-amber-700 bg-amber-50 px-4 py-2 rounded-xl mt-3">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-4">
        <div className="bg-cream/60 rounded-xl px-5 py-4 text-sm text-text-light space-y-1">
          <p>• Bảng giá trên dành cho <strong className="text-brown-dark">1–2 người</strong></p>
          <p>• Khách thêm giờ phụ thu <strong className="text-brown-dark">99.000đ/h</strong> <span className="text-text-muted">(vui lòng báo trước)</span></p>
        </div>
        <button
          onClick={onBack}
          className="w-full py-3 border border-border rounded-xl text-sm font-medium text-text-light hover:bg-cream transition-colors cursor-pointer"
        >
          {t("back")}
        </button>
      </div>
    </div>
  );
}

const FALLBACK_ROOMS = [
  {
    id: "11111111-1111-1111-1111-111111111101",
    name: "Ari",
    beds: "1 giường đôi 1.6m",
    capacity: "2 người lớn + 1 trẻ em",
    amenities: ["WiFi", "Điều hoà", "Bồn tắm", "Tủ lạnh"],
    image: "/images/rooms/ari-1.jpg",
    prices: { good_morning: 749000, midnight_hot: 749000, overnight: 849000, multi_night: 849000, fast_furious: 399000 },
  },
  {
    id: "11111111-1111-1111-1111-111111111102",
    name: "Crimson",
    beds: "2 giường đơn 1.2m",
    capacity: "2 người lớn + 1 trẻ em",
    amenities: ["WiFi", "Điều hoà", "Bồn tắm", "Tủ lạnh"],
    image: "/images/rooms/crimson-1.jpg",
    prices: { good_morning: 749000, midnight_hot: 749000, overnight: 849000, multi_night: 849000, fast_furious: 399000 },
  },
  {
    id: "11111111-1111-1111-1111-111111111103",
    name: "Gatou",
    beds: "1 giường đôi 1.8m",
    capacity: "2 người lớn + 1 trẻ em",
    amenities: ["WiFi", "Điều hoà", "Bồn tắm", "Tủ lạnh"],
    image: "/images/rooms/gatou-1.jpg",
    prices: { good_morning: 649000, midnight_hot: 649000, overnight: 749000, multi_night: 749000, fast_furious: 399000 },
  },
  {
    id: "11111111-1111-1111-1111-111111111104",
    name: "Inme",
    beds: "2 giường đôi 1.6m",
    capacity: "4 người lớn + 2 trẻ em",
    amenities: ["WiFi", "Điều hoà", "Bồn tắm", "Tủ lạnh"],
    image: "/images/rooms/inme-1.jpg",
    prices: { good_morning: 799000, midnight_hot: 799000, overnight: 949000, multi_night: 949000, fast_furious: 449000 },
  },
  {
    id: "11111111-1111-1111-1111-111111111105",
    name: "Rome",
    beds: "1 giường đôi 1.4m",
    capacity: "2 người lớn",
    amenities: ["WiFi", "Điều hoà", "Bồn tắm", "Tủ lạnh"],
    image: "/images/rooms/rome-1.jpg",
    prices: { good_morning: 749000, midnight_hot: 749000, overnight: 849000, multi_night: 849000, fast_furious: 399000 },
  },
  {
    id: "11111111-1111-1111-1111-111111111106",
    name: "Tame",
    beds: "1 đôi 1.8m + 2 đơn",
    capacity: "4 người lớn + 2 trẻ em",
    amenities: ["WiFi", "Điều hoà", "Bồn tắm", "Tủ lạnh"],
    image: "/images/rooms/tame-1.jpg",
    prices: { good_morning: 749000, midnight_hot: 749000, overnight: 849000, multi_night: 849000, fast_furious: 399000 },
  },
  {
    id: "11111111-1111-1111-1111-111111111107",
    name: "Tome",
    beds: "1 giường đôi 1.6m",
    capacity: "2 người lớn + 1 trẻ em",
    amenities: ["WiFi", "Điều hoà", "Bồn tắm", "Tủ lạnh"],
    image: "/images/rooms/tome-1.jpg",
    prices: { good_morning: 799000, midnight_hot: 799000, overnight: 949000, multi_night: 949000, fast_furious: 449000 },
  },
  {
    id: "11111111-1111-1111-1111-111111111108",
    name: "Woody",
    beds: "1 giường đôi 1.8m",
    capacity: "2 người lớn + 1 trẻ em",
    amenities: ["WiFi", "Điều hoà", "Bồn tắm", "Tủ lạnh"],
    image: "/images/rooms/woody-1.jpg",
    prices: { good_morning: 749000, midnight_hot: 749000, overnight: 849000, multi_night: 849000, fast_furious: 399000 },
  },
];
