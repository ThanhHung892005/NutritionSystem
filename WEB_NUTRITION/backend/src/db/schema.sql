-- NutritionSystem Database Schema
-- Chạy: psql -U postgres -d nutrition_system -f src/db/schema.sql

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name   VARCHAR(255),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- HEALTH PROFILES
-- ============================================================
CREATE TYPE activity_level AS ENUM (
  'sedentary',      -- Ít vận động (văn phòng)
  'light',          -- Vận động nhẹ 1-3 ngày/tuần
  'moderate',       -- Vận động vừa 3-5 ngày/tuần
  'active',         -- Vận động nhiều 6-7 ngày/tuần
  'very_active'     -- Vận động rất nhiều / lao động nặng
);

CREATE TYPE goal_type AS ENUM (
  'lose_weight',
  'maintain',
  'gain_muscle'
);

CREATE TABLE IF NOT EXISTS health_profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  age             SMALLINT NOT NULL CHECK (age BETWEEN 10 AND 120),
  gender          VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
  weight_kg       NUMERIC(5,2) NOT NULL CHECK (weight_kg > 0),
  height_cm       NUMERIC(5,2) NOT NULL CHECK (height_cm > 0),
  activity_level  activity_level NOT NULL DEFAULT 'sedentary',
  goal            goal_type NOT NULL DEFAULT 'maintain',
  diseases        TEXT[] DEFAULT '{}',    -- ['diabetes_t2', 'hypertension', ...]
  -- Tính toán tự động
  bmi             NUMERIC(5,2),
  bmr             NUMERIC(7,2),
  tdee            NUMERIC(7,2),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- WEIGHT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS weight_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weight_kg   NUMERIC(5,2) NOT NULL CHECK (weight_kg > 0),
  note        TEXT,
  logged_at   DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date
  ON weight_logs(user_id, logged_at DESC);

-- ============================================================
-- FOODS (Danh mục thực phẩm)
-- ============================================================
CREATE TABLE IF NOT EXISTS foods (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(255) NOT NULL,
  name_en     VARCHAR(255),
  calories    NUMERIC(7,2) NOT NULL,   -- kcal / 100g
  protein_g   NUMERIC(6,2) DEFAULT 0,
  carbs_g     NUMERIC(6,2) DEFAULT 0,
  fat_g       NUMERIC(6,2) DEFAULT 0,
  fiber_g     NUMERIC(6,2) DEFAULT 0,
  gi_index    SMALLINT,               -- Glycemic Index (0-100)
  -- Cờ phù hợp theo bệnh lý
  ok_diabetes   BOOLEAN DEFAULT TRUE,
  ok_hypertension BOOLEAN DEFAULT TRUE,
  ok_gout       BOOLEAN DEFAULT TRUE,
  ok_kidney     BOOLEAN DEFAULT TRUE,
  ok_celiac     BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEAL PLANS
-- ============================================================
CREATE TABLE IF NOT EXISTS meal_plans (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_date       DATE NOT NULL DEFAULT CURRENT_DATE,
  meals           JSONB NOT NULL DEFAULT '{}',  -- {breakfast: [...], lunch: [...], dinner: [...]}
  total_calories  NUMERIC(7,2),
  total_protein_g NUMERIC(6,2),
  total_carbs_g   NUMERIC(6,2),
  total_fat_g     NUMERIC(6,2),
  ai_generated    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, plan_date)
);

CREATE INDEX IF NOT EXISTS idx_meal_plans_user_date
  ON meal_plans(user_id, plan_date DESC);

-- ============================================================
-- TRIGGER: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_health_profiles_updated_at
  BEFORE UPDATE ON health_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
