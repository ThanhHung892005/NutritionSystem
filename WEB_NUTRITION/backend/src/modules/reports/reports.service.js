const db = require("../../db");
const nutritionService = require("../nutrition/nutrition.service");

const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function getMondayOfWeek(dateStr) {
  const d = dateStr ? new Date(dateStr + "T00:00:00") : new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

async function getWeeklyReport(userId, weekStartInput) {
  const weekStart = getMondayOfWeek(weekStartInput);
  const endDate = new Date(weekStart + "T00:00:00");
  endDate.setDate(endDate.getDate() + 6);
  const weekEnd = endDate.toISOString().slice(0, 10);

  const { rows: days } = await db.query(
    `WITH week_days AS (
       SELECT generate_series($2::date, $3::date, '1 day'::interval)::date AS day
     )
     SELECT
       wd.day                                     AS logged_at,
       COALESCE(SUM(ml.calories), 0)::numeric     AS calories,
       COALESCE(SUM(ml.protein_g), 0)::numeric    AS protein_g,
       COALESCE(SUM(ml.carbs_g), 0)::numeric      AS carbs_g,
       COALESCE(SUM(ml.fat_g), 0)::numeric        AS fat_g,
       COUNT(ml.id) > 0                           AS logged
     FROM week_days wd
     LEFT JOIN meal_logs ml
       ON ml.logged_at = wd.day AND ml.user_id = $1
     GROUP BY wd.day
     ORDER BY wd.day`,
    [userId, weekStart, weekEnd],
  );

  const { rows: weightLogs } = await db.query(
    `SELECT weight_kg, logged_at FROM weight_logs
     WHERE user_id = $1 AND logged_at BETWEEN $2 AND $3
     ORDER BY logged_at ASC`,
    [userId, weekStart, weekEnd],
  );

  let targetCalories = 2000;
  try {
    const calc = await nutritionService.calculate(userId);
    targetCalories = calc.target_calories;
  } catch {
    // no health profile yet — use default
  }

  const loggedDays = days.filter((d) => d.logged);
  const totalCalories = loggedDays.reduce(
    (s, d) => s + parseFloat(d.calories),
    0,
  );
  const avgDailyCalories = loggedDays.length
    ? Math.round(totalCalories / loggedDays.length)
    : 0;

  const macroAvg = loggedDays.length
    ? {
        protein_g: +(
          loggedDays.reduce((s, d) => s + parseFloat(d.protein_g), 0) /
          loggedDays.length
        ).toFixed(1),
        carbs_g: +(
          loggedDays.reduce((s, d) => s + parseFloat(d.carbs_g), 0) /
          loggedDays.length
        ).toFixed(1),
        fat_g: +(
          loggedDays.reduce((s, d) => s + parseFloat(d.fat_g), 0) /
          loggedDays.length
        ).toFixed(1),
      }
    : { protein_g: 0, carbs_g: 0, fat_g: 0 };

  const adherencePct = targetCalories
    ? Math.round((avgDailyCalories / targetCalories) * 100)
    : 0;

  const weightStart = weightLogs.length
    ? parseFloat(weightLogs[0].weight_kg)
    : null;
  const weightEnd =
    weightLogs.length > 1
      ? parseFloat(weightLogs[weightLogs.length - 1].weight_kg)
      : null;
  const weightChange =
    weightStart != null && weightEnd != null
      ? +(weightEnd - weightStart).toFixed(1)
      : null;

  return {
    weekStart,
    weekEnd,
    daysLogged: loggedDays.length,
    targetCalories,
    avgDailyCalories,
    totalCalories: Math.round(totalCalories),
    adherencePct,
    macroAvg,
    weightStart,
    weightEnd,
    weightChange,
    days: days.map((d) => {
      const date = new Date(d.logged_at + "T00:00:00");
      return {
        date: d.logged_at,
        dayLabel: DAY_LABELS[date.getDay()],
        calories: Math.round(parseFloat(d.calories)),
        protein_g: +parseFloat(d.protein_g).toFixed(1),
        carbs_g: +parseFloat(d.carbs_g).toFixed(1),
        fat_g: +parseFloat(d.fat_g).toFixed(1),
        logged: d.logged,
      };
    }),
  };
}

module.exports = { getWeeklyReport, getMondayOfWeek };
