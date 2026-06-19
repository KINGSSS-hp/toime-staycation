-- ============================================================
-- ToiME Staycation — Initial Schema
-- ============================================================

-- Enum cho 4 loại đặt phòng
CREATE TYPE booking_type AS ENUM (
  'good_morning',   -- 09:00–18:00 cùng ngày (KHÔNG nhận Chủ Nhật)
  'midnight_hot',   -- 21:00 → max 12:00 hôm sau
  'overnight',      -- 14:00 → 12:00 hôm sau
  'fast_furious'     -- nhiều đêm liên tiếp (14:00 → 12:00)
);

-- Enum cho trạng thái booking
CREATE TYPE booking_status AS ENUM (
  'pending',     -- chờ xác nhận thanh toán
  'confirmed',   -- đã xác nhận
  'cancelled',   -- đã huỷ
  'completed'    -- đã hoàn thành (sau check-out)
);

-- ============================================================
-- Bảng rooms
-- ============================================================
CREATE TABLE rooms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  capacity_adults   INT NOT NULL DEFAULT 2,
  capacity_children INT NOT NULL DEFAULT 1,
  beds        TEXT NOT NULL DEFAULT '1 giường đôi',
  amenities   TEXT[] DEFAULT '{}',
  images      TEXT[] DEFAULT '{}',
  sort_order  INT NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rooms_active ON rooms (active) WHERE active = true;
CREATE INDEX idx_rooms_sort ON rooms (sort_order);

-- ============================================================
-- Bảng room_prices — giá theo loại đặt
-- ============================================================
CREATE TABLE room_prices (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  booking_type booking_type NOT NULL,
  price       INT NOT NULL,  -- VND
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (room_id, booking_type)
);

CREATE INDEX idx_room_prices_room ON room_prices (room_id);

-- ============================================================
-- Bảng bookings
-- ============================================================
CREATE TABLE bookings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id       UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
  booking_type  booking_type NOT NULL,
  start_at      TIMESTAMPTZ NOT NULL,
  end_at        TIMESTAMPTZ NOT NULL,
  guest_name    TEXT NOT NULL,
  guest_phone   TEXT NOT NULL,
  guest_email   TEXT,
  note          TEXT,
  status        booking_status NOT NULL DEFAULT 'pending',
  payment_info  JSONB,  -- thông tin CK thủ công (nếu cần lưu)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_time_range CHECK (end_at > start_at)
);

CREATE INDEX idx_bookings_room_time ON bookings (room_id, start_at, end_at)
  WHERE status IN ('pending', 'confirmed');
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_bookings_start ON bookings (start_at);

-- ============================================================
-- Function kiểm tra overlap (dùng cho availability check)
-- ============================================================
CREATE OR REPLACE FUNCTION check_room_available(
  p_room_id UUID,
  p_start_at TIMESTAMPTZ,
  p_end_at TIMESTAMPTZ,
  p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE room_id = p_room_id
      AND status IN ('pending', 'confirmed')
      AND start_at < p_end_at
      AND end_at > p_start_at
      AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
  );
$$;

-- ============================================================
-- Trigger auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- rooms: ai cũng đọc được phòng active; chỉ admin sửa
CREATE POLICY rooms_read ON rooms
  FOR SELECT USING (active = true);

CREATE POLICY rooms_admin ON rooms
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- room_prices: ai cũng đọc; chỉ admin sửa
CREATE POLICY room_prices_read ON room_prices
  FOR SELECT USING (true);

CREATE POLICY room_prices_admin ON room_prices
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- bookings: tạo công khai qua API (service_role); admin đọc/sửa tất cả
CREATE POLICY bookings_admin ON bookings
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
