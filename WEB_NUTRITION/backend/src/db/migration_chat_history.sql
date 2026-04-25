-- Migration: chat_messages table
-- Lưu lịch sử hội thoại chatbot theo user

CREATE TABLE IF NOT EXISTS chat_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        VARCHAR(10) NOT NULL CHECK (role IN ('user', 'model')),
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user
  ON chat_messages(user_id, created_at DESC);
