-- Phase 2 Migration — NutritionSystem
-- Chạy: psql -U postgres -d nutrition_system -f src/db/migration_phase2.sql

-- ============================================================
-- MEAL LOGS (ghi lại bữa ăn hàng ngày)
-- ============================================================
CREATE TABLE IF NOT EXISTS meal_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logged_at   DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type   VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  food_id     UUID REFERENCES foods(id) ON DELETE SET NULL,
  food_name   VARCHAR(255) NOT NULL,
  amount_g    NUMERIC(7,2) NOT NULL CHECK (amount_g > 0),
  calories    NUMERIC(7,2) NOT NULL CHECK (calories >= 0),
  protein_g   NUMERIC(6,2) NOT NULL DEFAULT 0,
  carbs_g     NUMERIC(6,2) NOT NULL DEFAULT 0,
  fat_g       NUMERIC(6,2) NOT NULL DEFAULT 0,
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meal_logs_user_date
  ON meal_logs(user_id, logged_at DESC);
