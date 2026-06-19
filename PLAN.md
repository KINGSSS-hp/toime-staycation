# Kế hoạch Build ToiME Staycation

## Context

Website đặt phòng homestay/villa (6–20 phòng), lấy **cấu trúc La Rosa Homestay** làm tham chiếu,
dùng **palette + logic đặt phòng riêng của ToiME**. Thư mục dự án hiện trống (greenfield).

Quyết định đã chốt:
- Booking UX: **theo 4 loại của ToiME** (chọn loại → chọn ngày/khung giờ).
- Thiết kế: **lấy cảm hứng La Rosa, dùng palette ToiME** (kem/nâu đất/xanh rêu + Be Vietnam Pro).
- Khi dựng UI: LUÔN chạy `/ui-ux-pro-max` + `/frontend-design` trước khi code.

---

## Phần 1 — Tham chiếu La Rosa

### 1.1 Header
Menu cố định: Giới thiệu · Phòng nghỉ · Đánh giá · Vị trí · Đặt phòng + toggle EN/VI.

### 1.2 Các thành phần trang (13 section)

| # | Section | Nội dung | Áp dụng ToiME |
|---|---------|----------|----------------|
| 1 | **Hero** | Ảnh + tagline + 2 CTA | ✅ đổi ảnh/tagline |
| 2 | **Key metrics** | Điểm đánh giá, khoảng cách | ✅ đổi số liệu |
| 3 | **Booking form** | check-in/out, số khách, captcha | 🔁 **Thay bằng 4 loại đặt ToiME** |
| 4 | **Tiện nghi** | Icon + label | ✅ |
| 5 | **Giới thiệu** | Câu chuyện, điểm nổi bật | ✅ |
| 6 | **Danh sách phòng** | Card phòng + giá | ✅ giá theo 4 loại |
| 7 | **Menu ẩm thực** | Đồ ăn/uống | ⚪ Optional |
| 8 | **Đánh giá khách** | Testimonial cards | ✅ |
| 9 | **Vị trí + bản đồ** | Map nhúng | ✅ |
| 10 | **Blog** | Cẩm nang du lịch | ⚪ Giai đoạn sau |
| 11 | **FAQ** | Câu hỏi thường gặp | ✅ |
| 12 | **Footer** | Liên hệ, social | ✅ |
| 13 | **Floating Contact** | 3 nút nổi: Messenger, Zalo, Phone | ✅ |

### 1.3 Hiệu ứng chuyển đổi section
- **Scroll-triggered**: fade-in / slide-up khi cuộn tới (Framer Motion `useInView` + `motion.div`).
- **Smooth scrolling**: toàn trang + menu anchor.
- **Parallax nhẹ**: hero image, ảnh nền section.
- **Staggered animation**: cards xuất hiện lần lượt.
- **Page transition**: `AnimatePresence` giữa các trang.

### 1.4 Card phòng
Ảnh · Tên · Mô tả · **Bảng giá 4 loại** (thay giá/đêm) · Giường · Sức chứa · Tiện nghi ✓ · Nút "Đặt phòng này".

### 1.5 Thiết kế (mood)
Rustic-modern, nền kem/trắng, nhiều whitespace, layout grid + card, ảnh phong cảnh.
→ ToiME giữ tinh thần ấm cúng nhưng đổi sang palette nâu đất/xanh rêu.

---

## Phần 2 — Kiến trúc & kế hoạch build

### 2.1 Stack
Next.js 15 App Router · TypeScript · Supabase (Postgres + Auth) · Ant Design 5 · Tailwind CSS · **Framer Motion** · next-intl (vi/en) · Vercel (+ Vercel Cron).

### 2.2 Cấu trúc thư mục
```
app/
  [locale]/
    page.tsx                       # Landing (tất cả section)
    booking/page.tsx               # Trang đặt phòng
    admin/
      page.tsx                     # Calendar view
      revenue/page.tsx             # Báo cáo doanh thu
    layout.tsx
  api/
    bookings/route.ts              # Tạo booking (guest checkout)
    availability/route.ts          # Kiểm tra phòng trống
    notify/route.ts                # Gửi Zalo OA + Telegram
  cron/reminder/route.ts           # Vercel Cron nhắc trước 1 ngày
components/
  sections/                        # Hero, Metrics, Amenities, About, RoomList, Reviews, Location, FAQ, Footer
  booking/                         # BookingTypeSelector, DateTimePicker, RoomPicker, GuestForm
  rooms/RoomCard.tsx
  shared/FloatingContact.tsx       # 3 nút Messenger/Zalo/Phone cố định góc dưới phải
lib/
  booking/rules.ts                 # Logic 4 loại đặt (giờ check-in/out, chặn CN)
  supabase/                        # client + server
  notify/                          # zalo.ts, telegram.ts
i18n/                              # next-intl config + messages vi.json/en.json
```

### 2.3 Mô hình dữ liệu (Supabase)
- **`rooms`** — id, name, slug, description, capacity_adults, capacity_children, beds, amenities[], images[], active
- **`room_prices`** — room_id, booking_type, price *(giá theo 4 loại)*
- **`bookings`** — id, room_id, booking_type, start_at, end_at, guest_name, guest_phone, guest_email, note, status, created_at
- `availability` suy ra từ `bookings` (kiểm tra overlap theo start_at/end_at).
- RLS: chỉ admin (auth) đọc/ghi quản trị; tạo booking công khai qua API server-side.

### 2.4 Logic 4 loại đặt — `lib/booking/rules.ts`
1. **Good Morning**: 09:00–18:00 cùng ngày, **chặn Chủ Nhật**.
2. **Midnight Hot**: 21:00 → tối đa 12:00 hôm sau.
3. **Overnight**: check-in 14:00 / check-out 12:00 hôm sau.
4. **Multi-night**: nhiều đêm liên tiếp (check-in 14:00 / check-out 12:00).
> Mỗi loại có hàm tính `start_at`/`end_at` từ ngày khách chọn + ràng buộc hợp lệ; dùng chung cho UI lẫn API.

### 2.5 Luồng đặt phòng (UX theo ToiME)
**Chọn loại đặt** (4 card) → **Chọn ngày** (+ khung giờ tự suy ra) → **Kiểm tra trống** → **Chọn phòng** → **Form khách** (tên + SĐT + email + ghi chú) → **Xác nhận** + hiện thông tin CK.
Guest checkout, không cần tài khoản.

### 2.6 Admin (trong scope)
- **Calendar view**: lịch tất cả phòng (Ant Design Calendar/timeline), màu theo loại đặt.
- **Báo cáo doanh thu**: tổng theo ngày/tháng + theo loại đặt.
- Đăng nhập qua Supabase Auth. *Không* có quản lý booking/phòng trong scope hiện tại.

### 2.7 Thông báo (2 chiều)

**Cho chủ homestay (Zalo OA + Telegram):**
- Booking mới → gửi ngay đầy đủ: tên khách · SĐT · email · loại đặt · phòng · ngày/giờ check-in → check-out · ghi chú · trạng thái thanh toán
- Khách huỷ → thông báo chủ
- Vercel Cron hàng ngày: tổng hợp danh sách khách check-in ngày mai
> Mục tiêu: chủ nhận Zalo/Telegram là nắm đủ thông tin, không cần mở admin.

**Cho khách (Zalo OA + Telegram):**
- Đặt thành công: xác nhận phòng + thời gian + thông tin CK
- Nhắc 1 ngày trước check-in (Vercel Cron)
- Khi bị huỷ phòng

### 2.8 Thanh toán
Chuyển khoản thủ công — hiển thị thông tin CK ở bước xác nhận; chưa tích hợp cổng thanh toán.

### 2.9 Floating Contact Buttons
3 nút cố định (fixed) góc dưới phải mọi trang:
1. **Messenger** — mở chat Facebook Messenger
2. **Zalo** — mở chat Zalo / Zalo OA
3. **Phone** — gọi trực tiếp (tel: link)
> Icon tròn xếp dọc, hiệu ứng hover/pulse nhẹ, responsive (thu nhỏ trên mobile).

---

## Phần 3 — Thứ tự triển khai

| Bước | Công việc | Ghi chú |
|------|-----------|---------|
| 0 | ~~Tạo `CLAUDE.md`~~ | ✅ Đã xong |
| 1 | Scaffold Next.js 15 + Tailwind + Ant Design + next-intl + Framer Motion | Theme palette + Be Vietnam Pro |
| 2 | Supabase schema + seed dữ liệu mẫu | rooms, room_prices, bookings |
| 3 | `lib/booking/rules.ts` + unit test | Chặn CN, biên giờ |
| 4 | Landing page (tất cả section + floating contact + animation) | **`/ui-ux-pro-max` + `/frontend-design`** |
| 5 | Trang booking (4 loại → form → tạo booking) | **`/ui-ux-pro-max` + `/frontend-design`** |
| 6 | Admin (calendar + doanh thu) | **`/ui-ux-pro-max`** |
| 7 | Thông báo Zalo/Telegram (2 chiều: chủ + khách) + Vercel Cron | |
| 8 | i18n vi/en, responsive, polish | |

---

## Verification
- `npm run dev` → landing đủ section, đổi ngôn ngữ vi/en.
- Unit test `lib/booking/rules.ts`: Good Morning chặn CN; Midnight Hot cap 12:00; Overnight 14:00→12:00; Multi-night nhiều đêm.
- Tạo booking thử → ghi DB + chặn overlap + thông báo chủ qua Zalo/Telegram đầy đủ thông tin.
- Admin calendar + doanh thu hiển thị đúng.
- Floating contact buttons hoạt động trên desktop + mobile.
- Animation scroll mượt, parallax, staggered cards.
- Lighthouse / responsive mobile.

## Cần từ bạn
- Thông tin thực: tên phòng, giá theo từng loại, ảnh, thông tin liên hệ/CK, link FB/IG/Zalo, toạ độ bản đồ.
- Credentials: Supabase project, Zalo OA token, Telegram Bot token, Vercel project.
