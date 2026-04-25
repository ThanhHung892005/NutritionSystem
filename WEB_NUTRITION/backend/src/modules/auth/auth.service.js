const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../db");

async function register({ email, password, fullName }) {
  const exists = await db.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  if (exists.rows.length > 0) {
    throw Object.assign(new Error("Email đã được sử dụng"), { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const { rows } = await db.query(
    `INSERT INTO users (email, password_hash, full_name)
     VALUES ($1, $2, $3)
     RETURNING id, email, full_name, created_at`,
    [email, passwordHash, fullName || null],
  );

  const user = rows[0];
  return { user, token: signToken(user.id) };
}

async function login({ email, password }) {
  const { rows } = await db.query(
    "SELECT id, email, full_name, password_hash FROM users WHERE email = $1",
    [email],
  );

  if (rows.length === 0) {
    throw Object.assign(new Error("Email hoặc mật khẩu không đúng"), {
      status: 401,
    });
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw Object.assign(new Error("Email hoặc mật khẩu không đúng"), {
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
