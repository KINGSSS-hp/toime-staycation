-- Đổi multi_night → fast_furious trong enum booking_type
ALTER TYPE booking_type RENAME VALUE 'multi_night' TO 'fast_furious';

-- Xoá giá multi_night cũ và thêm giá fast_furious (flat price, cùng cho tất cả phòng)
DELETE FROM room_prices WHERE booking_type = 'fast_furious';

-- Fast & Furious dùng giá flat (399k/499k/549k) không theo phòng
-- Giá được tính trong application code (getFastFuriousPrice)
-- Vẫn cần 1 entry trong room_prices để API availability hoạt động
INSERT INTO room_prices (room_id, booking_type, price)
SELECT id, 'fast_furious', 399000 FROM rooms;
