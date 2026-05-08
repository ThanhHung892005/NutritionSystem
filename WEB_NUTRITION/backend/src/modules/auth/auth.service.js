const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../db");

async function register({ username, password, fullName }) {
  const exists = await db.query("SELECT id FROM users WHERE username = $1", [
    username,
  ]);
  if (exists.rows.length > 0) {
    throw Object.assign(new Error("Tên đăng nhập đã được sử dụng"), { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const { rows } = await db.query(
    `INSERT INTO users (email, username, password_hash, full_name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, full_name, created_at`,
    [username + "@local", username, passwordHash, fullName || null],
  );

  const user = rows[0];
  return { user, token: signToken(user.id) };
}

async function login({ username, password }) {
  const { rows } = await db.query(
    "SELECT id, username, full_name, password_hash FROM users WHERE username = $1",
    [username],
  );

  if (rows.length === 0) {
    throw Object.assign(new Error("Tên đăng nhập hoặc mật khẩu không đúng"), {
      status: 401,
    });
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw Object.assign(new Error("Tên đăng nhập hoặc mật khẩu không đúng"), {
      status: 401,
    });
  }

  const { password_hash: _, ...safeUser } = user;
  return { user: safeUser, token: signToken(user.id) };
}

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

module.exports = { register, login };
