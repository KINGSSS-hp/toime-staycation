# CLAUDE.md — ToiME Staycation

Website đặt phòng homestay/villa (6–20 phòng). Đây là dự án thực tế của chủ homestay,
cần vận hành được ngay. **Ưu tiên chất lượng & khả năng mở rộng hơn là ship MVP nhanh** —
khi đề xuất giải pháp, chọn kiến trúc clean & scalable thay vì shortcut.

## Tech stack
- **Next.js 15** (App Router) + TypeScript
- **Supabase** (Postgres + Auth)
- **Ant Design 5** + **Tailwind CSS**
- **next-intl** (song ngữ vi/en)
- Deploy **Vercel** (kèm Vercel Cron)

## Ngôn ngữ & giao tiếp
- Trả lời người dùng bằng **tiếng Việt**.
- UI hỗ trợ **vi/en** qua next-intl; mọi chuỗi hiển thị đặt trong file message, không hardcode.

## Logic cốt lõi — 4 loại đặt phòng
Đặt trong `lib/booking/rules.ts`, dùng chung cho cả UI lẫn API:
1. **Good Morning**: 09:00–18:00 cùng ngày — **KHÔNG nhận Chủ Nhật**.
2. **Midnight Hot**: 21:00 → tối đa 12:00 ngày hôm sau.
3. **Overnight**: check-in 14:00 / check-out 12:00 hôm sau.
4. **Multi-night**: nhiều đêm liên tiếp (14:00 → 12:00).
> Mỗi loại có hàm tính `start_at`/`end_at` từ ngày khách chọn + ràng buộc hợp lệ.
> Kiểm tra phòng trống = kiểm tra overlap thời gian trên bảng `bookings`.

## Xác thực (Auth)
- **Admin**: đăng nhập qua Supabase Auth.
- **Khách**: guest checkout (tên + SĐT + email), KHÔNG cần tài khoản.

## Admin (trong scope hiện tại)
- **Calendar view**: lịch tất cả phòng, màu theo loại đặt.
- **Báo cáo doanh thu**: theo ngày/tháng + theo loại đặt.
- KHÔNG có quản lý booking / quản lý phòng trong scope hiện tại.

## Thông báo
**Cho chủ homestay (qua Zalo OA / Telegram Bot)** — khi có booking mới, gửi ngay thông tin đầy đủ:
- Tên khách, SĐT, email
- Loại đặt (Good Morning / Midnight Hot / Overnight / Multi-night)
- Phòng đã chọn, ngày/giờ check-in → check-out
- Ghi chú của khách (nếu có)
- Trạng thái thanh toán
> Mục tiêu: chủ nhận Zalo/Telegram là nắm đủ thông tin, không cần mở admin.

**Cho khách (qua Zalo OA / Telegram Bot):**
- Đặt thành công: xác nhận phòng + thời gian + thông tin chuyển khoản.
- Nhắc 1 ngày trước check-in (Vercel Cron).
- Khi huỷ phòng.

**Cho chủ khi có thay đổi:**
- Khách huỷ booking → thông báo chủ.
- Reminder tổng hợp: danh sách khách check-in ngày mai (Vercel Cron cùng lúc nhắc khách).

## Thanh toán
- Chưa cần cổng thanh toán — **chuyển khoản thủ công** (hiện thông tin CK ở bước xác nhận).

## Thiết kế (Cozy / ấm cúng)
- Palette: kem `#F5F0E8`, nâu đất `#8B5E3C`, xanh rêu `#4A7C59`.
- Font: **Be Vietnam Pro**.
- Tinh thần: rustic-modern, nhiều whitespace, layout grid + card, ảnh phong cảnh.
- Tham chiếu cấu trúc/UX: larosahomestay.com (KHÔNG copy màu/font La Rosa).
- **Khi thiết kế giao diện**, LUÔN sử dụng:
  - `/ui-ux-pro-max` — chọn style, palette, font pairing, layout, responsive, animation, accessibility.
  - `/frontend-design` — định hướng thẩm mỹ, typography, tránh giao diện mặc định/template.
  > Mục tiêu: giao diện **tối ưu, đẹp và tự nhiên nhất** — không được trông như template mặc định.
- **Hiệu ứng chuyển đổi giữa các section**:
  - Scroll-triggered animations: mỗi section fade-in / slide-up khi cuộn tới (dùng **Framer Motion** hoặc **AOS**).
  - Smooth scrolling toàn trang (`scroll-behavior: smooth`).
  - Parallax nhẹ cho hero image và các ảnh nền section.
  - Staggered animation cho danh sách (room cards, amenities, testimonials) — các phần tử xuất hiện lần lượt.
  - Transition mượt khi chuyển trang (page transition với Framer Motion `AnimatePresence`).
  > Ưu tiên **Framer Motion** vì tích hợp tốt với React/Next.js, hỗ trợ `useInView`, `motion.div`, `AnimatePresence`.

## Floating Contact Buttons (góc dưới phải)
3 nút liên hệ nhanh **cố định (fixed)** ở góc dưới bên phải mọi trang:
1. **Messenger** — mở chat Facebook Messenger.
2. **Zalo** — mở chat Zalo (link zalo.me hoặc Zalo OA).
3. **Phone** — gọi trực tiếp (tel: link).
> Hiển thị dạng icon tròn xếp dọc, có hiệu ứng hover/pulse nhẹ, responsive (thu nhỏ trên mobile).
> Component đặt tại `components/shared/FloatingContact.tsx`, render trong root layout.

## Cấu trúc thư mục
- `app/[locale]/` — landing, booking, admin
- `app/api/` — bookings, availability, notify
- `app/cron/reminder/` — Vercel Cron
- `components/sections/` — Hero, Metrics, Amenities, RoomList, Reviews, Location, FAQ, Footer
- `components/booking/` — BookingTypeSelector, DateTimePicker, RoomPicker, GuestForm
- `components/shared/FloatingContact.tsx` — 3 nút Messenger/Zalo/Phone cố định góc dưới phải
- `lib/booking/rules.ts` — logic 4 loại đặt
- `lib/supabase/`, `lib/notify/` (zalo, telegram), `i18n/`

## Quy ước
- Validate dữ liệu booking ở **server-side** (API route) trước khi ghi DB.
- Supabase RLS: chỉ admin (auth) thao tác quản trị; tạo booking công khai qua API server.
- Viết unit test cho `lib/booking/rules.ts` (đặc biệt: chặn Chủ Nhật, biên giờ).
