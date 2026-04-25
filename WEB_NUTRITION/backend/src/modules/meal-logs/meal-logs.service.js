const db = require("../../db");

async function getLogs(userId, date) {
  const d = date || new Date().toISOString().slice(0, 10);
  const { rows } = await db.query(
    `SELECT id, meal_type, food_id, food_name, amount_g,
            calories, protein_g, carbs_g, fat_g, note, logged_at, created_at
     FROM meal_logs
     WHERE user_id = $1 AND logged_at = $2
     ORDER BY created_at ASC`,
    [userId, d],
  );

  const totals = rows.reduce(
    (acc, r) => ({
      calories: acc.calories + parseFloat(r.calories),
      protein_g: acc.protein_g + parseFloat(r.protein_g),
      carbs_g: acc.carbs_g + parseFloat(r.carbs_g),
      fat_g: acc.fat_g + parseFloat(r.fat_g),
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  );

  return { date: d, logs: rows, totals };
}

async function addLog(userId, data) {
  const { mealType, foodId, foodName, amountG, calories, loggedAt, note } =
    data;

  let finalCalories = parseFloat(calories) || 0;
  let proteinG = 0,
    carbsG = 0,
    fatG = 0;

  if (foodId) {
    const { rows } = await db.query(
      "SELECT calories, protein_g, carbs_g, fat_g FROM foods WHERE id = $1",
      [foodId],
    );
    if (!rows.length) {
      throw Object.assign(new Error("Thực phẩm không tồn tại"), {
        status: 404,
      });
    }
    const ratio = amountG / 100;
    finalCalories = +(rows[0].calories * ratio).toFixed(1);
    proteinG = +(rows[0].protein_g * ratio).toFixed(1);
    carbsG = +(rows[0].carbs_g * ratio).toFixed(1);
    fatG = +(rows[0].fat_g * ratio).toFixed(1);
  }

  const date = loggedAt || new Date().toISOString().slice(0, 10);

  const { rows } = await db.query(
    `INSERT INTO meal_logs
       (user_id, logged_at, meal_type, food_id, food_name, amount_g,
        calories, protein_g, carbs_g, fat_g, note)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      userId,
      date,
      mealType,
      foodId || null,
      foodName,
      amountG,
      finalCalories,
      proteinG,
      carbsG,
      fatG,
      note || null,
    ],
  );

  return rows[0];
}

async function deleteLog(userId, logId) {
  const { rowCount } = await db.query(
    "DELETE FROM meal_logs WHERE id = $1 AND user_id = $2",
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
