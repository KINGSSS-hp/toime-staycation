-- ============================================================
-- Seed data — ToiME Staycation (dữ liệu mẫu)
-- ============================================================

-- Phòng mẫu
INSERT INTO rooms (id, name, slug, description, capacity_adults, capacity_children, beds, amenities, images, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Ari', 'ari',
   'Phòng ấm cúng với giường đôi lớn, view sân vườn, trang bị đầy đủ tiện nghi.',
   2, 1, '1 giường đôi 1.6m',
   ARRAY['wifi', 'điều hoà', 'nóng lạnh', 'tủ lạnh mini', 'ban công'],
   ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'],
   1),

  ('11111111-1111-1111-1111-111111111102', 'Crimson', 'crimson',
   'Phòng rộng rãi với 2 giường đơn, phù hợp nhóm bạn hoặc gia đình nhỏ.',
   2, 1, '2 giường đơn 1.2m',
   ARRAY['wifi', 'điều hoà', 'nóng lạnh', 'tủ lạnh mini'],
   ARRAY['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600&q=80'],
   2),

  ('11111111-1111-1111-1111-111111111103', 'Gatou', 'gatou',
   'Phòng cao cấp với không gian mở, bồn tắm riêng và view thiên nhiên.',
   2, 1, '1 giường đôi 1.8m',
   ARRAY['wifi', 'điều hoà', 'nóng lạnh', 'bồn tắm', 'ban công', 'tủ lạnh mini', 'ấm đun nước'],
   ARRAY['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80'],
   3),

  ('11111111-1111-1111-1111-111111111104', 'Inme', 'inme',
   'Phòng lớn cho gia đình, có phòng khách nhỏ và 2 giường lớn.',
   4, 2, '2 giường đôi 1.6m',
   ARRAY['wifi', 'điều hoà', 'nóng lạnh', 'tủ lạnh mini', 'ban công', 'sofa', 'ấm đun nước'],
   ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80'],
   4),

  ('11111111-1111-1111-1111-111111111105', 'Rome', 'rome',
   'Phòng studio nhỏ gọn, tiện nghi, phù hợp cho cặp đôi.',
   2, 0, '1 giường đôi 1.4m',
   ARRAY['wifi', 'điều hoà', 'nóng lạnh'],
   ARRAY['https://images.unsplash.com/photo-1598928506311-c55ez637a42?w=600&q=80'],
   5),

  ('11111111-1111-1111-1111-111111111106', 'Tame', 'tame',
   'Villa riêng biệt giữa vườn cây, có sân vườn, bếp nhỏ và phòng khách.',
   4, 2, '1 giường đôi 1.8m + 2 giường đơn',
   ARRAY['wifi', 'điều hoà', 'nóng lạnh', 'bồn tắm', 'ban công', 'tủ lạnh', 'bếp nhỏ', 'sân vườn riêng'],
   ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'],
   6),

  ('11111111-1111-1111-1111-111111111107', 'Tome', 'tome',
   'Phòng Tome phong cách hiện đại, ấm cúng với view đẹp.',
   2, 1, '1 giường đôi 1.6m',
   ARRAY['wifi', 'điều hoà', 'nóng lạnh', 'tủ lạnh mini', 'ban công'],
   ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'],
   7),

  ('11111111-1111-1111-1111-111111111108', 'Woody', 'woody',
   'Phòng Woody nội thất gỗ tự nhiên, không gian mộc mạc.',
   2, 1, '1 giường đôi 1.8m',
   ARRAY['wifi', 'điều hoà', 'nóng lạnh', 'bồn tắm', 'ban công'],
   ARRAY['https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600&q=80'],
   8);

-- Giá theo 4 loại đặt (VND)
-- Deluxe Đôi
INSERT INTO room_prices (room_id, booking_type, price) VALUES
  ('11111111-1111-1111-1111-111111111101', 'good_morning', 350000),
  ('11111111-1111-1111-1111-111111111101', 'midnight_hot', 400000),
  ('11111111-1111-1111-1111-111111111101', 'overnight', 500000),
  ('11111111-1111-1111-1111-111111111101', 'fast_furious', 450000);

-- Deluxe Twin
INSERT INTO room_prices (room_id, booking_type, price) VALUES
  ('11111111-1111-1111-1111-111111111102', 'good_morning', 350000),
  ('11111111-1111-1111-1111-111111111102', 'midnight_hot', 400000),
  ('11111111-1111-1111-1111-111111111102', 'overnight', 500000),
  ('11111111-1111-1111-1111-111111111102', 'fast_furious', 450000);

-- Superior
INSERT INTO room_prices (room_id, booking_type, price) VALUES
  ('11111111-1111-1111-1111-111111111103', 'good_morning', 450000),
  ('11111111-1111-1111-1111-111111111103', 'midnight_hot', 500000),
  ('11111111-1111-1111-1111-111111111103', 'overnight', 650000),
  ('11111111-1111-1111-1111-111111111103', 'fast_furious', 600000);

-- Family
INSERT INTO room_prices (room_id, booking_type, price) VALUES
  ('11111111-1111-1111-1111-111111111104', 'good_morning', 550000),
  ('11111111-1111-1111-1111-111111111104', 'midnight_hot', 600000),
  ('11111111-1111-1111-1111-111111111104', 'overnight', 800000),
  ('11111111-1111-1111-1111-111111111104', 'fast_furious', 750000);

-- Studio
INSERT INTO room_prices (room_id, booking_type, price) VALUES
  ('11111111-1111-1111-1111-111111111105', 'good_morning', 250000),
  ('11111111-1111-1111-1111-111111111105', 'midnight_hot', 300000),
  ('11111111-1111-1111-1111-111111111105', 'overnight', 400000),
  ('11111111-1111-1111-1111-111111111105', 'fast_furious', 350000);

-- Villa Garden
INSERT INTO room_prices (room_id, booking_type, price) VALUES
  ('11111111-1111-1111-1111-111111111106', 'good_morning', 700000),
  ('11111111-1111-1111-1111-111111111106', 'midnight_hot', 800000),
  ('11111111-1111-1111-1111-111111111106', 'overnight', 1000000),
  ('11111111-1111-1111-1111-111111111106', 'fast_furious', 900000);

-- Tome
INSERT INTO room_prices (room_id, booking_type, price) VALUES
  ('11111111-1111-1111-1111-111111111107', 'good_morning', 400000),
  ('11111111-1111-1111-1111-111111111107', 'midnight_hot', 450000),
  ('11111111-1111-1111-1111-111111111107', 'overnight', 550000),
  ('11111111-1111-1111-1111-111111111107', 'fast_furious', 399000);

-- Woody
INSERT INTO room_prices (room_id, booking_type, price) VALUES
  ('11111111-1111-1111-1111-111111111108', 'good_morning', 450000),
  ('11111111-1111-1111-1111-111111111108', 'midnight_hot', 500000),
  ('11111111-1111-1111-1111-111111111108', 'overnight', 650000),
  ('11111111-1111-1111-1111-111111111108', 'fast_furious', 399000);
