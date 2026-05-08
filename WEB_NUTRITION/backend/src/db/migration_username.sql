-- Migration: thêm cột username vào bảng users
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;

-- Tạo index để tìm kiếm nhanh theo username
CREATE UNIQUE INDEX IF NOT EXISTS users_username_idx ON users (username);
