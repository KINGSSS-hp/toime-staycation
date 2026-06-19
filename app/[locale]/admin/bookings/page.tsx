"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

const TYPE_LABELS: Record<string, string> = {
  good_morning: "Good Morning",
  midnight_hot: "Midnight Hot",
  overnight: "Chill All Day",
  fast_furious: "Fast & Furious",
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  good_morning: { bg: "bg-amber-100", text: "text-amber-700" },
  midnight_hot: { bg: "bg-indigo-100", text: "text-indigo-700" },
  overnight: { bg: "bg-emerald-100", text: "text-emerald-700" },
  fast_furious: { bg: "bg-rose-100", text: "text-rose-700" },
};

function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}

interface Booking {
  id: string;
  room_name: string;
  booking_type: string;
  start_at: string;
  end_at: string;
  guest_name: string;
  guest_phone: string;
  guest_email: string | null;
  note: string | null;
  status: string;
  price: number;
  created_at: string;
}

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled";

export default function BookingsPage() {
  const t = useTranslations("admin");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateStatus(bookingId: string, status: "confirmed" | "cancelled") {
    setUpdating(bookingId);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId, status }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
        );
      }
    } catch {}
    setUpdating(null);
  }

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/stats?month=${currentMonth.getMonth() + 1}&year=${currentMonth.getFullYear()}`)
      .then((r) => r.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setRooms(data.rooms || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentMonth]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (roomFilter !== "all" && b.room_name !== roomFilter) return false;
      return true;
    });
  }, [bookings, statusFilter, roomFilter]);

  const monthLabel = currentMonth.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brown-dark">Danh sách Booking</h1>
        <p className="text-sm text-text-muted mt-1">Tất cả booking trong tháng</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-light hover:bg-cream transition-colors cursor-pointer">←</button>
          <span className="text-sm font-semibold text-brown-dark min-w-[140px] text-center capitalize">{monthLabel}</span>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-light hover:bg-cream transition-colors cursor-pointer">→</button>
        </div>

        <div className="flex gap-1 ml-auto">
          {(["all", "pending", "confirmed", "cancelled"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === s ? "bg-brown text-white" : "text-text-muted hover:bg-cream border border-border/50"
              }`}
            >
              {s === "all" ? "Tất cả" : s === "pending" ? "Chờ" : s === "confirmed" ? "Xác nhận" : "Đã huỷ"}
            </button>
          ))}
        </div>

        <select
          value={roomFilter}
          onChange={(e) => setRoomFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs border border-border/50 bg-white text-text-light focus:outline-none focus:border-brown"
        >
          <option value="all">Tất cả phòng</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.name}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-text-muted mb-3">{filtered.length} booking</p>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-border/40 animate-pulse h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-border/40 text-center">
          <p className="text-text-muted">Không có booking nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const colors = TYPE_COLORS[b.booking_type] || { bg: "bg-gray-100", text: "text-gray-700" };
            const isExpanded = expanded === b.id;
            return (
              <div key={b.id} className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpanded(isExpanded ? null : b.id)}
                  className="w-full text-left px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-cream-light/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-brown-dark">{b.guest_name}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${colors.bg} ${colors.text}`}>
                        {TYPE_LABELS[b.booking_type]}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">
                      {b.room_name} · {new Date(b.start_at).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })} → {new Date(b.end_at).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-brown-dark flex-shrink-0">{formatVND(b.price)}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium flex-shrink-0 ${
                    b.status === "confirmed" ? "bg-green/10 text-green" : b.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                  }`}>
                    {b.status === "confirmed" ? "Xác nhận" : b.status === "cancelled" ? "Đã huỷ" : "Chờ"}
                  </span>
                  <span className={`text-text-muted transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>▼</span>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-4 pt-0 border-t border-border/20">
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mt-3">
                      <div>
                        <dt className="text-text-muted text-xs">Số điện thoại</dt>
                        <dd className="font-medium text-brown-dark">{b.guest_phone}</dd>
                      </div>
                      <div>
                        <dt className="text-text-muted text-xs">Email</dt>
                        <dd className="font-medium text-brown-dark">{b.guest_email || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-text-muted text-xs">Check-in</dt>
                        <dd className="font-medium text-brown-dark">{new Date(b.start_at).toLocaleString("vi-VN")}</dd>
                      </div>
                      <div>
                        <dt className="text-text-muted text-xs">Check-out</dt>
                        <dd className="font-medium text-brown-dark">{new Date(b.end_at).toLocaleString("vi-VN")}</dd>
                      </div>
                      {b.note && (
                        <div className="col-span-2">
                          <dt className="text-text-muted text-xs">Ghi chú</dt>
                          <dd className="font-medium text-brown-dark">{b.note}</dd>
                        </div>
                      )}
                      <div className="col-span-2">
                        <dt className="text-text-muted text-xs">Ngày đặt</dt>
                        <dd className="font-medium text-text-muted">{new Date(b.created_at).toLocaleString("vi-VN")}</dd>
                      </div>
                    </dl>

                    {b.status !== "cancelled" && (
                      <div className="flex gap-2 mt-4 pt-3 border-t border-border/20">
                        {b.status === "pending" && (
                          <button
                            onClick={() => updateStatus(b.id, "confirmed")}
                            disabled={updating === b.id}
                            className="px-4 py-2 bg-green text-white text-xs font-semibold rounded-xl hover:bg-green-dark transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {updating === b.id ? "Đang xử lý..." : "✓ Xác nhận booking"}
                          </button>
                        )}
                        <button
                          onClick={() => updateStatus(b.id, "cancelled")}
                          disabled={updating === b.id}
                          className="px-4 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {updating === b.id ? "Đang xử lý..." : "✕ Huỷ booking"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
