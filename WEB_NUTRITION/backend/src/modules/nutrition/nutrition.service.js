const db = require("../../db");

// ─── Công thức tính ──────────────────────────────────────────
// BMI  = weight(kg) / height(m)²
// BMR  = Mifflin-St Jeor (1990) — chính xác hơn Harris-Benedict
//   Nam:  10×weight + 6.25×height - 5×age + 5
//   Nữ:   10×weight + 6.25×height - 5×age - 161
// TDEE = BMR × activity multiplier

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

function calcBMI(weightKg, heightCm) {
  const h = heightCm / 100;
  return Math.round((weightKg / (h * h)) * 10) / 10;
}

function calcBMR(weightKg, heightCm, age, gender) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(gender === "male" ? base + 5 : base - 161);
}

function calcTDEE(bmr, activityLevel) {
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2));
}

function classifyBMI(bmi) {
  if (bmi < 18.5) return "Thiếu cân";
  if (bmi < 23) return "Bình thường";
  if (bmi < 27.5) return "Thừa cân";
  return "Béo phì";
}

// ─── DB operations ───────────────────────────────────────────

async function getProfile(userId) {
  const { rows } = await db.query(
    "SELECT * FROM health_profiles WHERE user_id = $1",
    [userId],
  );
  return rows[0] || null;
}

async function upsertProfile(userId, data) {
  const { age, gender, weightKg, heightCm, activityLevel, goal, diseases } =
    data;

  const bmi = calcBMI(weightKg, heightCm);
  const bmr = calcBMR(weightKg, heightCm, age, gender);
  const tdee = calcTDEE(bmr, activityLevel);

  const { rows } = await db.query(
    `INSERT INTO health_profiles
       (user_id, age, gender, weight_kg, height_cm, activity_level, goal, diseases, bmi, bmr, tdee)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     ON CONFLICT (user_id) DO UPDATE SET
       age=$2, gender=$3, weight_kg=$4, height_cm=$5,
       activity_level=$6, goal=$7, diseases=$8,
       bmi=$9, bmr=$10, tdee=$11,
       updated_at=NOW()
     RETURNING *`,
    [
      userId,
      age,
      gender,
      weightKg,
      heightCm,
      activityLevel,
      goal ?? "maintain",
      diseases ?? [],
      bmi,
      bmr,
      tdee,
    ],
  );

  return { ...rows[0], bmi_classification: classifyBMI(bmi) };
}

async function calculate(userId) {
  const profile = await getProfile(userId);
  if (!profile)
    throw Object.assign(new Error("Chưa có hồ sơ sức khỏe"), { status: 404 });

  const { weight_kg, height_cm, age, gender, activity_level, goal } = profile;
  const bmi = calcBMI(weight_kg, height_cm);
  const bmr = calcBMR(weight_kg, height_cm, age, gender);
  const tdee = calcTDEE(bmr, activity_level);

  const targetCalories =
    goal === "lose_weight"
      ? tdee - 500
      : goal === "gain_muscle"
        ? tdee + 300
        : tdee;

  return {
    bmi,
    bmi_classification: classifyBMI(bmi),
    bmr,
    tdee,
    target_calories: targetCalories,
    goal,
  };
}

module.exports = { getProfile, upsertProfile, calculate };
