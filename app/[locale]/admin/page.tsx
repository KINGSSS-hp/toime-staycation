"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

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

interface AdminData {
  summary: {
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    todayBookings: number;
    activeRooms: number;
    totalRooms: number;
  };
  bookings: Array<{
    id: string;
    room_name: string;
    booking_type: string;
    start_at: string;
    end_at: string;
    guest_name: string;
    guest_phone: string;
    status: string;
    price: number;
    created_at: string;
  }>;
  revenueByType: Record<string, number>;
}

export default function AdminDashboard() {
  const t = useTranslations("admin");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    fetch(`/api/admin/stats?month=${now.getMonth() + 1}&year=${now.getFullYear()}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
  const recentBookings = bookings.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brown-dark">{t("dashboard")}</h1>
        <p className="text-sm text-text-muted mt-1">{t("dashboard_desc")}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-border/40 shadow-sm">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Booking hôm nay</p>
          <p className="text-3xl font-bold text-brown">{summary.todayBookings}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border/40 shadow-sm">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Phòng đang sử dụng</p>
          <p className="text-3xl font-bold text-green">{summary.activeRooms}<span className="text-base font-normal text-text-muted">/{summary.totalRooms}</span></p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border/40 shadow-sm">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Doanh thu tháng</p>
          <p className="text-2xl font-bold text-brown-dark">{formatVND(summary.totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border/40 shadow-sm">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Tổng booking tháng</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-brown-dark">{summary.totalBookings}</p>
            <div className="flex gap-1 text-[11px]">
              <span className="px-1.5 py-0.5 rounded bg-green/10 text-green">{summary.confirmedBookings} ✓</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-600">{summary.pendingBookings} ⏳</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue by Type */}
        <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-brown-dark mb-4 uppercase tracking-wider">Doanh thu theo loại đặt</h3>
          <div className="space-y-3">
            {Object.entries(TYPE_LABELS).map(([key, label]) => {
              const amount = revenueByType[key] || 0;
              const pct = summary.totalRevenue > 0 ? (amount / summary.totalRevenue) * 100 : 0;
              const colors = TYPE_COLORS[key];
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} w-28 text-center flex-shrink-0`}>{label}</span>
                  <div className="flex-1 h-5 bg-cream rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors.bg} transition-all duration-700`} style={{ width: `${Math.max(pct, 2)}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-brown-dark w-28 text-right flex-shrink-0">{formatVND(amount)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm">
          <h3 className="text-sm font-semibold text-brown-dark mb-4 uppercase tracking-wider">Trạng thái</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Đã xác nhận</span>
              <span className="text-sm font-bold text-green">{summary.confirmedBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Đang chờ</span>
              <span className="text-sm font-bold text-amber-600">{summary.pendingBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Đã huỷ</span>
              <span className="text-sm font-bold text-red-500">{summary.cancelledBookings}</span>
            </div>
            <hr className="border-border/30" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted font-medium">Trung bình/booking</span>
              <span className="text-sm font-bold text-brown-dark">
                {summary.confirmedBookings > 0 ? formatVND(Math.round(summary.totalRevenue / summary.confirmedBookings)) : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-brown-dark uppercase tracking-wider">Booking gần đây</h3>
          <Link href="/admin/bookings" className="text-xs text-brown hover:text-brown-dark font-medium transition-colors">Xem tất cả →</Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">Chưa có booking nào trong tháng</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/20 text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-3 font-medium">Khách</th>
                  <th className="text-left px-4 py-3 font-medium">Phòng</th>
                  <th className="text-left px-4 py-3 font-medium">Loại đặt</th>
                  <th className="text-left px-4 py-3 font-medium">Check-in</th>
                  <th className="text-right px-4 py-3 font-medium">Giá</th>
                  <th className="text-center px-6 py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => {
                  const colors = TYPE_COLORS[b.booking_type] || { bg: "bg-gray-100", text: "text-gray-700" };
                  return (
                    <tr key={b.id} className="border-b border-border/10 last:border-b-0 hover:bg-cream-light/50">
                      <td className="px-6 py-3">
                        <p className="font-medium text-brown-dark">{b.guest_name}</p>
                        <p className="text-[11px] text-text-muted">{b.guest_phone}</p>
                      </td>
                      <td className="px-4 py-3 text-text-light">{b.room_name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${colors.bg} ${colors.text}`}>
                          {TYPE_LABELS[b.booking_type] || b.booking_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted text-xs">
                        {new Date(b.start_at).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-brown-dark">{formatVND(b.price)}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          b.status === "confirmed" ? "bg-green/10 text-green" : b.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                        }`}>
                          {b.status === "confirmed" ? "Xác nhận" : b.status === "cancelled" ? "Đã huỷ" : "Chờ"}
                        </span>
                      </td>
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
