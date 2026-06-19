"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

interface BookingEvent {
  id: string;
  roomName: string;
  roomId: string;
  bookingType: string;
  guestName: string;
  startAt: Date;
  endAt: Date;
  status: string;
}

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  good_morning: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  midnight_hot: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  overnight: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  fast_furious: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

const TYPE_LABELS: Record<string, string> = {
  good_morning: "Good Morning",
  midnight_hot: "Midnight Hot",
  overnight: "Chill All Day",
  fast_furious: "Fast & Furious",
};

const SAMPLE_ROOMS = [
  "Ari",
  "Crimson",
  "Gatou",
  "Inme",
  "Rome",
  "Tame",
  "Tome",
  "Woody",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generateSampleBookings(month: Date): BookingEvent[] {
  const bookings: BookingEvent[] = [];
  const types = ["good_morning", "midnight_hot", "overnight", "fast_furious"];
  const names = ["Nguyễn An", "Trần Bình", "Lê Chi", "Phạm Duy", "Hoàng Em", "Vũ Phong", "Đỗ Giang", "Bùi Hoa"];
  const year = month.getFullYear();
  const m = month.getMonth();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const rand = seededRandom(year * 100 + m);

  for (let i = 0; i < 18; i++) {
    const day = Math.floor(rand() * daysInMonth) + 1;
    const roomIdx = Math.floor(rand() * SAMPLE_ROOMS.length);
    const typeIdx = Math.floor(rand() * types.length);
    const nameIdx = Math.floor(rand() * names.length);
    const type = types[typeIdx];

    let startAt: Date, endAt: Date;
    if (type === "good_morning") {
      startAt = new Date(year, m, day, 9);
      endAt = new Date(year, m, day, 18);
    } else if (type === "midnight_hot") {
      startAt = new Date(year, m, day, 21);
      endAt = new Date(year, m, day + 1, 12);
    } else if (type === "overnight") {
      startAt = new Date(year, m, day, 14);
      endAt = new Date(year, m, day + 1, 12);
    } else {
      const nights = 2 + Math.floor(rand() * 3);
      startAt = new Date(year, m, day, 14);
      endAt = new Date(year, m, day + nights, 12);
    }

    bookings.push({
      id: `demo-${i}`,
      roomName: SAMPLE_ROOMS[roomIdx],
      roomId: `room-${roomIdx}`,
      bookingType: type,
      guestName: names[nameIdx],
      startAt,
      endAt,
      status: rand() > 0.2 ? "confirmed" : "pending",
    });
  }

  return bookings;
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

export default function AdminCalendarPage() {
  const t = useTranslations("admin");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);
  const bookings = useMemo(() => generateSampleBookings(currentMonth), [currentMonth]);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getBookingsForDay = (day: Date, room: string) => {
    return bookings.filter((b) => {
      if (b.roomName !== room) return false;
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      return b.startAt <= dayEnd && b.endAt >= dayStart;
    });
  };

  const monthLabel = currentMonth.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brown-dark">{t("calendar")}</h1>
          <p className="text-sm text-text-muted mt-1">{t("calendar_desc")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-light hover:bg-cream transition-colors cursor-pointer"
          >
            ←
          </button>
          <span className="text-sm font-semibold text-brown-dark min-w-[140px] text-center capitalize">
            {monthLabel}
          </span>
          <button
            onClick={nextMonth}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-light hover:bg-cream transition-colors cursor-pointer"
          >
            →
          </button>
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

      {/* Calendar grid */}
      <div className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/30">
                <th className="sticky left-0 z-10 bg-cream px-3 py-3 text-left font-semibold text-text-muted w-36 min-w-36">
                  {t("room")}
                </th>
                {days.map((day) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isSunday = day.getDay() === 0;
                  return (
                    <th
                      key={day.toISOString()}
                      className={`px-1 py-3 text-center font-medium min-w-[36px] ${
                        isToday
                          ? "bg-brown/10 text-brown"
                          : isSunday
                            ? "text-red-400"
                            : "text-text-muted"
                      }`}
                    >
                      <div>{day.getDate()}</div>
                      <div className="text-[10px] font-normal">
                        {day.toLocaleDateString("vi-VN", { weekday: "narrow" })}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ROOMS.map((room) => (
                <tr key={room} className="border-b border-border/20 last:border-b-0">
                  <td className="sticky left-0 z-10 bg-white px-3 py-2 font-medium text-brown-dark border-r border-border/20">
                    {room}
                  </td>
                  {days.map((day) => {
                    const dayBookings = getBookingsForDay(day, room);
                    return (
                      <td
                        key={day.toISOString()}
                        className="px-0.5 py-1 align-top"
                      >
                        {dayBookings.map((b) => {
                          const colors = TYPE_COLORS[b.bookingType];
                          return (
                            <div
                              key={b.id}
                              className={`${colors.bg} ${colors.text} border ${colors.border} rounded px-1 py-0.5 mb-0.5 truncate cursor-default`}
                              title={`${b.guestName} · ${TYPE_LABELS[b.bookingType]} · ${b.status}`}
                            >
                              {b.guestName.split(" ").pop()}
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
    </div>
  );
}
