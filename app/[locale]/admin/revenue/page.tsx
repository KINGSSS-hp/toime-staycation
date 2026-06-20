"use client";

import { useState, useEffect, useMemo } from "react";

const TYPE_LABELS: Record<string, string> = {
  good_morning: "Good Morning",
  midnight_hot: "Midnight Hot",
  overnight: "Chill All Day",
  multi_night: "Multi-night",
  fast_furious: "Fast & Furious",
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  good_morning: { bg: "bg-amber-100", text: "text-amber-700" },
  midnight_hot: { bg: "bg-indigo-100", text: "text-indigo-700" },
  overnight: { bg: "bg-emerald-100", text: "text-emerald-700" },
  multi_night: { bg: "bg-purple-100", text: "text-purple-700" },
  fast_furious: { bg: "bg-rose-100", text: "text-rose-700" },
};

function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}

interface AdminData {
  summary: {
    totalRevenue: number;
    confirmedBookings: number;
    pendingBookings: number;
  };
  bookings: Array<{
    id: string;
    room_name: string;
    booking_type: string;
    guest_name: string;
    status: string;
    price: number;
    created_at: string;
  }>;
  revenueByType: Record<string, number>;
  revenueByDay: Record<string, number>;
}

export default function RevenuePage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/stats?month=${currentMonth.getMonth() + 1}&year=${currentMonth.getFullYear()}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentMonth]);

  const dailyRevenue = useMemo(() => {
    if (!data?.revenueByDay) return [];
    return Object.entries(data.revenueByDay).sort(([a], [b]) => a.localeCompare(b));
  }, [data]);

  const maxDaily = useMemo(() => {
    return Math.max(...dailyRevenue.map(([, v]) => v), 1);
  }, [dailyRevenue]);

  const monthLabel = currentMonth.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-border/40 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <p className="text-text-muted text-center py-12">Không thể tải dữ liệu</p>;
  }

  const { summary, bookings, revenueByType } = data;
  const confirmed = bookings.filter((b) => b.status === "confirmed");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brown-dark">Doanh thu</h1>
          <p className="text-sm text-text-muted mt-1">Báo cáo doanh thu theo tháng</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-light hover:bg-cream transition-colors cursor-pointer">←</button>
          <span className="text-sm font-semibold text-brown-dark min-w-[140px] text-center capitalize">{monthLabel}</span>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-light hover:bg-cream transition-colors cursor-pointer">→</button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-border/40 shadow-sm">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-brown">{formatVND(summary.totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border/40 shadow-sm">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Đã xác nhận</p>
          <p className="text-2xl font-bold text-green">{summary.confirmedBookings}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border/40 shadow-sm">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Đang chờ</p>
          <p className="text-2xl font-bold text-amber-600">{summary.pendingBookings}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border/40 shadow-sm">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">TB/booking</p>
          <p className="text-2xl font-bold text-brown-dark">
            {summary.confirmedBookings > 0 ? formatVND(Math.round(summary.totalRevenue / summary.confirmedBookings)) : "—"}
          </p>
        </div>
      </div>

      {/* Revenue by Type */}
      <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm mb-8">
        <h3 className="text-sm font-semibold text-brown-dark mb-4 uppercase tracking-wider">Doanh thu theo loại đặt</h3>
        <div className="space-y-3">
          {Object.entries(TYPE_LABELS).map(([key, label]) => {
            const amount = revenueByType[key] || 0;
            const pct = summary.totalRevenue > 0 ? (amount / summary.totalRevenue) * 100 : 0;
            const colors = TYPE_COLORS[key];
            return (
              <div key={key} className="flex items-center gap-3">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} w-28 text-center flex-shrink-0`}>{label}</span>
                <div className="flex-1 h-6 bg-cream rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${colors.bg} transition-all duration-500`} style={{ width: `${Math.max(pct, 2)}%` }} />
                </div>
                <span className="text-xs font-semibold text-brown-dark w-28 text-right flex-shrink-0">{formatVND(amount)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Chart */}
      <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm mb-8">
        <h3 className="text-sm font-semibold text-brown-dark mb-4 uppercase tracking-wider">Doanh thu theo ngày</h3>
        {dailyRevenue.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">Chưa có dữ liệu</p>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {dailyRevenue.map(([date, amount]) => {
              const height = (amount / maxDaily) * 100;
              const day = new Date(date).getDate();
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-1 group">
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
        )}
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/30">
          <h3 className="text-sm font-semibold text-brown-dark uppercase tracking-wider">Chi tiết booking</h3>
        </div>
        {confirmed.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">Chưa có booking xác nhận</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/20 text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-3 font-medium">Ngày</th>
                  <th className="text-left px-4 py-3 font-medium">Khách</th>
                  <th className="text-left px-4 py-3 font-medium">Phòng</th>
                  <th className="text-left px-4 py-3 font-medium">Loại</th>
                  <th className="text-right px-6 py-3 font-medium">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {confirmed.map((b) => {
                  const colors = TYPE_COLORS[b.booking_type] || { bg: "bg-gray-100", text: "text-gray-700" };
                  return (
                    <tr key={b.id} className="border-b border-border/10 last:border-b-0 hover:bg-cream-light/50">
                      <td className="px-6 py-3 font-mono text-text-muted text-xs">{b.created_at.split("T")[0]}</td>
                      <td className="px-4 py-3 text-brown-dark font-medium">{b.guest_name}</td>
                      <td className="px-4 py-3 text-text-light">{b.room_name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${colors.bg} ${colors.text}`}>
                          {TYPE_LABELS[b.booking_type]}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-semibold text-brown-dark">{formatVND(b.price)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
