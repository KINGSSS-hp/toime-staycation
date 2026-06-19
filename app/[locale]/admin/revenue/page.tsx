"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

type ViewMode = "daily" | "monthly";

interface RevenueEntry {
  date: string;
  bookingType: string;
  roomName: string;
  guestName: string;
  amount: number;
  status: string;
}

const TYPE_LABELS: Record<string, string> = {
  good_morning: "Good Morning",
  midnight_hot: "Midnight Hot",
  overnight: "Chill All Day",
  fast_furious: "Fast & Furious",
};

const TYPE_COLORS: Record<string, string> = {
  good_morning: "bg-amber-100 text-amber-700",
  midnight_hot: "bg-indigo-100 text-indigo-700",
  overnight: "bg-emerald-100 text-emerald-700",
  fast_furious: "bg-rose-100 text-rose-700",
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generateSampleRevenue(month: Date): RevenueEntry[] {
  const entries: RevenueEntry[] = [];
  const types = Object.keys(TYPE_LABELS);
  const rooms = ["Ari", "Crimson", "Gatou", "Inme", "Rome", "Tame", "Tome", "Woody"];
  const names = ["Nguyễn An", "Trần Bình", "Lê Chi", "Phạm Duy", "Hoàng Em", "Vũ Phong"];
  const prices: Record<string, number[]> = {
    good_morning: [250000, 350000, 450000, 550000, 700000],
    midnight_hot: [300000, 400000, 500000, 600000, 800000],
    overnight: [400000, 500000, 650000, 800000, 1000000],
    fast_furious: [700000, 900000, 1200000, 1500000, 1800000],
  };

  const year = month.getFullYear();
  const m = month.getMonth();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const rand = seededRandom(year * 100 + m + 7);

  for (let i = 0; i < 30; i++) {
    const day = Math.floor(rand() * daysInMonth) + 1;
    const typeIdx = Math.floor(rand() * types.length);
    const type = types[typeIdx];
    const priceArr = prices[type];

    entries.push({
      date: new Date(year, m, day).toISOString().split("T")[0],
      bookingType: type,
      roomName: rooms[Math.floor(rand() * rooms.length)],
      guestName: names[Math.floor(rand() * names.length)],
      amount: priceArr[Math.floor(rand() * priceArr.length)],
      status: rand() > 0.15 ? "confirmed" : "pending",
    });
  }

  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}

export default function RevenuePage() {
  const t = useTranslations("admin");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  const entries = useMemo(() => generateSampleRevenue(currentMonth), [currentMonth]);

  const totalRevenue = entries
    .filter((e) => e.status === "confirmed")
    .reduce((sum, e) => sum + e.amount, 0);

  const revenueByType = useMemo(() => {
    const map: Record<string, number> = {};
    entries
      .filter((e) => e.status === "confirmed")
      .forEach((e) => {
        map[e.bookingType] = (map[e.bookingType] || 0) + e.amount;
      });
    return map;
  }, [entries]);

  const dailyRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    entries
      .filter((e) => e.status === "confirmed")
      .forEach((e) => {
        map[e.date] = (map[e.date] || 0) + e.amount;
      });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [entries]);

  const maxDaily = Math.max(...dailyRevenue.map(([, v]) => v), 1);

  const monthLabel = currentMonth.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  const confirmedCount = entries.filter((e) => e.status === "confirmed").length;
  const pendingCount = entries.filter((e) => e.status === "pending").length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brown-dark">{t("revenue")}</h1>
          <p className="text-sm text-text-muted mt-1">{t("revenue_desc")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
              )
            }
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-light hover:bg-cream transition-colors cursor-pointer"
          >
            ←
          </button>
          <span className="text-sm font-semibold text-brown-dark min-w-[140px] text-center capitalize">
            {monthLabel}
          </span>
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
              )
            }
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-light hover:bg-cream transition-colors cursor-pointer"
          >
            →
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-border/40 shadow-sm">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
            {t("total_revenue")}
          </p>
          <p className="text-2xl font-bold text-brown">{formatVND(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border/40 shadow-sm">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
            {t("confirmed_bookings")}
          </p>
          <p className="text-2xl font-bold text-green">{confirmedCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border/40 shadow-sm">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
            {t("pending_bookings")}
          </p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border/40 shadow-sm">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
            {t("avg_per_booking")}
          </p>
          <p className="text-2xl font-bold text-brown-dark">
            {confirmedCount > 0 ? formatVND(Math.round(totalRevenue / confirmedCount)) : "—"}
          </p>
        </div>
      </div>

      {/* Revenue by type */}
      <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm mb-8">
        <h3 className="text-sm font-semibold text-brown-dark mb-4 uppercase tracking-wider">
          {t("revenue_by_type")}
        </h3>
        <div className="space-y-3">
          {Object.entries(TYPE_LABELS).map(([key, label]) => {
            const amount = revenueByType[key] || 0;
            const pct = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-xs font-medium text-text-muted w-24 flex-shrink-0">
                  {label}
                </span>
                <div className="flex-1 h-6 bg-cream rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${TYPE_COLORS[key].split(" ")[0]} transition-all duration-500`}
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-brown-dark w-28 text-right flex-shrink-0">
                  {formatVND(amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily chart */}
      <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-brown-dark uppercase tracking-wider">
            {t("daily_revenue")}
          </h3>
          <div className="flex gap-1">
            {(["daily", "monthly"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === mode
                    ? "bg-brown text-white"
                    : "text-text-muted hover:bg-cream"
                }`}
              >
                {t(mode)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-end gap-1 h-40">
          {dailyRevenue.map(([date, amount]) => {
            const height = (amount / maxDaily) * 100;
            const day = new Date(date).getDate();
            return (
              <div
                key={date}
                className="flex-1 flex flex-col items-center gap-1 group"
              >
                <div
                  className="w-full bg-brown/20 hover:bg-brown/40 rounded-t transition-colors cursor-default relative"
                  style={{ height: `${Math.max(height, 4)}%` }}
                  title={`${date}: ${formatVND(amount)}`}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatVND(amount)}
                  </div>
                </div>
                <span className="text-[9px] text-text-muted">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail table */}
      <div className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/30">
          <h3 className="text-sm font-semibold text-brown-dark uppercase tracking-wider">
            {t("booking_list")}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20 text-text-muted text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-3 font-medium">{t("date_col")}</th>
                <th className="text-left px-4 py-3 font-medium">{t("guest_col")}</th>
                <th className="text-left px-4 py-3 font-medium">{t("room_col")}</th>
                <th className="text-left px-4 py-3 font-medium">{t("type_col")}</th>
                <th className="text-right px-6 py-3 font-medium">{t("amount_col")}</th>
                <th className="text-center px-4 py-3 font-medium">{t("status_col")}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={i} className="border-b border-border/10 last:border-b-0 hover:bg-cream-light/50">
                  <td className="px-6 py-3 font-mono text-text-muted">{entry.date}</td>
                  <td className="px-4 py-3 text-brown-dark font-medium">{entry.guestName}</td>
                  <td className="px-4 py-3 text-text-light">{entry.roomName}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${TYPE_COLORS[entry.bookingType]}`}>
                      {TYPE_LABELS[entry.bookingType]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-brown-dark">
                    {formatVND(entry.amount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        entry.status === "confirmed"
                          ? "bg-green/10 text-green"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {entry.status === "confirmed" ? t("confirmed") : t("pending")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
