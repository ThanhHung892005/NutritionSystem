const db = require("../../db");

async function getLogs(userId, limit = 30) {
  const { rows } = await db.query(
    `SELECT id, weight_kg, note, logged_at, created_at
     FROM weight_logs
     WHERE user_id = $1
     ORDER BY logged_at DESC
     LIMIT $2`,
    [userId, limit],
  );
  return rows;
}

async function addLog(userId, { weightKg, loggedAt, note }) {
  const date = loggedAt || new Date().toISOString().slice(0, 10);
  const { rows } = await db.query(
    `INSERT INTO weight_logs (user_id, weight_kg, logged_at, note)
     VALUES ($1, $2, $3, $4)
     RETURNING id, weight_kg, logged_at, note, created_at`,
    [userId, weightKg, date, note || null],
  );
  return rows[0];
}

async function deleteLog(userId, logId) {
  const { rowCount } = await db.query(
    `DELETE FROM weight_logs WHERE id = $1 AND user_id = $2`,
    [logId, userId],
  );
  if (rowCount === 0) {
    throw Object.assign(
      new Error("Không tìm thấy log hoặc không có quyền xóa"),
      {
        status: 404,
      },
    );
  }
}

module.exports = { getLogs, addLog, deleteLog };
