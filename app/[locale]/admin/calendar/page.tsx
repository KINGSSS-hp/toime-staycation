"use client";

import { useState, useEffect, useMemo } from "react";

const TYPE_LABELS: Record<string, string> = {
  good_morning: "Good Morning",
  midnight_hot: "Midnight Hot",
  overnight: "Chill All Day",
  multi_night: "Multi-night",
  fast_furious: "Fast & Furious",
};

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  good_morning: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  midnight_hot: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  overnight: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  multi_night: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  fast_furious: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

interface Booking {
  id: string;
  room_name: string;
  booking_type: string;
  start_at: string;
  end_at: string;
  guest_name: string;
  status: string;
}

function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days: Date[] = [];
  const count = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= count; d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/stats?month=${currentMonth.getMonth() + 1}&year=${currentMonth.getFullYear()}`)
      .then((r) => r.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setRooms((data.rooms || []).map((r: { name: string }) => r.name));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentMonth]);

  const days = useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);

  const getBookingsForDay = (day: Date, room: string) => {
    return bookings.filter((b) => {
      if (b.room_name !== room || b.status === "cancelled") return false;
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);
      const bStart = new Date(b.start_at);
      const bEnd = new Date(b.end_at);
      return bStart <= dayEnd && bEnd >= dayStart;
    });
  };

  const monthLabel = currentMonth.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brown-dark">Lịch đặt phòng</h1>
          <p className="text-sm text-text-muted mt-1">Tổng quan booking tất cả phòng theo tháng</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-light hover:bg-cream transition-colors cursor-pointer">←</button>
          <span className="text-sm font-semibold text-brown-dark min-w-[140px] text-center capitalize">{monthLabel}</span>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-light hover:bg-cream transition-colors cursor-pointer">→</button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(TYPE_LABELS).map(([key, label]) => {
          const colors = TYPE_COLORS[key];
          return (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${colors.bg} border ${colors.border}`} />
              <span className="text-xs text-text-muted">{label}</span>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-8 border border-border/40 animate-pulse h-64" />
      ) : (
        <div className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="sticky left-0 z-10 bg-cream px-3 py-3 text-left font-semibold text-text-muted w-24 min-w-24">Phòng</th>
                  {days.map((day) => {
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isSunday = day.getDay() === 0;
                    return (
                      <th key={day.toISOString()} className={`px-1 py-3 text-center font-medium min-w-[36px] ${isToday ? "bg-brown/10 text-brown" : isSunday ? "text-red-400" : "text-text-muted"}`}>
                        <div>{day.getDate()}</div>
                        <div className="text-[10px] font-normal">{day.toLocaleDateString("vi-VN", { weekday: "narrow" })}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room} className="border-b border-border/20 last:border-b-0">
                    <td className="sticky left-0 z-10 bg-white px-3 py-2 font-medium text-brown-dark border-r border-border/20">{room}</td>
                    {days.map((day) => {
                      const dayBookings = getBookingsForDay(day, room);
                      return (
                        <td key={day.toISOString()} className="px-0.5 py-1 align-top">
                          {dayBookings.map((b) => {
                            const colors = TYPE_COLORS[b.booking_type] || TYPE_COLORS.good_morning;
                            return (
                              <div
                                key={b.id}
                                className={`${colors.bg} ${colors.text} border ${colors.border} rounded px-1 py-0.5 mb-0.5 truncate cursor-default`}
                                title={`${b.guest_name} · ${TYPE_LABELS[b.booking_type]} · ${b.status}`}
                              >
                                {b.guest_name.split(" ").pop()}
                              </div>
                            );
                          })}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
