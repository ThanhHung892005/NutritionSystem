const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require("../../db");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const DISEASE_LABELS = {
  diabetes_t2: "tiểu đường type 2",
  hypertension: "tăng huyết áp",
  heart: "tim mạch",
  gout: "gout",
  kidney: "bệnh thận",
  celiac: "celiac (không gluten)",
};

const GOAL_LABEL = {
  lose_weight: "Giảm cân",
  maintain: "Duy trì cân nặng",
  gain_muscle: "Tăng cơ",
};

const ACTIVITY_LABEL = {
  sedentary: "Ít vận động",
  light: "Vận động nhẹ",
  moderate: "Vận động vừa",
  active: "Vận động nhiều",
  very_active: "Vận động rất nhiều",
};

function buildPrompt(profile, targetCalories, dates) {
  const diseases = profile.diseases || [];
  const diseaseStr = diseases.map((d) => DISEASE_LABELS[d] || d).join(", ");

  const restrictions = [];
  if (diseases.includes("diabetes_t2"))
    restrictions.push(
      "- Tiểu đường: tránh đường, cơm trắng, chuối chín, nước ngọt. Ưu tiên GI thấp (gạo lứt, yến mạch, rau xanh).",
    );
  if (diseases.includes("hypertension"))
    restrictions.push(
      "- Tăng huyết áp: hạn chế muối (<1500mg natri/ngày), tránh đồ ăn chế biến sẵn, mì gói.",
    );
  if (diseases.includes("gout"))
    restrictions.push(
      "- Gout: tránh hải sản giàu purin, nội tạng, bia rượu, thịt đỏ nhiều. Ưu tiên đậu hũ, rau xanh, sữa ít béo.",
    );
  if (diseases.includes("kidney"))
    restrictions.push(
      "- Bệnh thận: hạn chế protein (<0.8g/kg), kali, phosphate. Tránh gạo lứt, yến mạch, chuối. Ưu tiên gạo trắng.",
    );
  if (diseases.includes("celiac"))
    restrictions.push(
      "- Celiac: tuyệt đối không gluten. Loại trừ lúa mì, yến mạch, bánh mì, mì. Dùng gạo, khoai, ngô.",
    );
  if (diseases.includes("heart"))
    restrictions.push(
      "- Tim mạch: tránh chất béo bão hòa, mỡ động vật. Ưu tiên dầu ô liu, cá hồi, rau xanh, hạt.",
    );

  return `Bạn là chuyên gia dinh dưỡng AI. Hãy tạo thực đơn 7 ngày cho người dùng sau.

THÔNG TIN NGƯỜI DÙNG:
- Tuổi: ${profile.age}, Giới tính: ${profile.gender === "male" ? "Nam" : "Nữ"}
- Cân nặng: ${profile.weight_kg}kg, Chiều cao: ${profile.height_cm}cm
- Mục tiêu: ${GOAL_LABEL[profile.goal] || profile.goal}
- Calo mục tiêu mỗi ngày: ${targetCalories} kcal
- Mức độ vận động: ${ACTIVITY_LABEL[profile.activity_level] || profile.activity_level}
${
  diseaseStr
    ? `
TÌNH TRẠNG SỨC KHỎE: ${diseaseStr}

QUY TẮC NGHIÊM NGẶT (bắt buộc tuân thủ):
${restrictions.join("\n")}`
    : "\nKhông có bệnh lý đặc biệt."
}

YÊU CẦU THỰC ĐƠN:
- 3 bữa chính: sáng (breakfast), trưa (lunch), tối (dinner)
- Mỗi bữa 2-4 món, thực phẩm Việt Nam là chủ đạo
- Phân phối calo: sáng ~25%, trưa ~40%, tối ~35%
- Không lặp lại cùng món quá 2 lần trong tuần
- Tổng calo mỗi ngày phải gần ${targetCalories} kcal (±100 kcal)

Ngày cần tạo: ${dates.join(", ")}

Trả về JSON thuần túy, không có markdown, không có giải thích ngoài JSON:
{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "meals": {
        "breakfast": [{"name": "Tên món", "amount": "150g", "calories": 250, "protein_g": 20, "carbs_g": 15, "fat_g": 8}],
        "lunch": [...],
        "dinner": [...]
      },
      "total_calories": ${targetCalories},
      "total_protein_g": 100,
      "total_carbs_g": 150,
      "total_fat_g": 50,
      "notes": "Ghi chú dinh dưỡng ngắn cho ngày này"
    }
  ]
}`;
}

async function generatePlan(userId, startDate) {
  const { rows } = await db.query(
    "SELECT * FROM health_profiles WHERE user_id = $1",
    [userId],
  );
  if (!rows.length) {
    throw Object.assign(
      new Error("Chưa có hồ sơ sức khỏe. Vui lòng nhập hồ sơ trước."),
      { status: 400 },
    );
  }
  const profile = rows[0];

  const targetCalories =
    profile.goal === "lose_weight"
      ? Math.round(profile.tdee - 500)
      : profile.goal === "gain_muscle"
        ? Math.round(profile.tdee + 300)
        : Math.round(profile.tdee);

  const base = startDate ? new Date(startDate) : new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  const prompt = buildPrompt(profile, targetCalories, dates);

  let rawText;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    rawText = result.response.text();
  } catch (err) {
    console.error("Gemini API error:", err.message);
    throw Object.assign(
      new Error("Không thể kết nối AI. Vui lòng thử lại sau."),
      { status: 503 },
    );
  }

  let weekPlan;
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON");
    weekPlan = JSON.parse(jsonMatch[0]);
  } catch {
    console.error("Failed to parse Gemini response:", rawText.slice(0, 300));
    throw Object.assign(
      new Error("Phản hồi AI không đúng định dạng. Vui lòng thử lại."),
      { status: 502 },
    );
  }

  const saved = [];
  for (const day of weekPlan.days) {
    const { rows: r } = await db.query(
      `INSERT INTO meal_plans
         (user_id, plan_date, meals, total_calories, total_protein_g, total_carbs_g, total_fat_g, ai_generated)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
       ON CONFLICT (user_id, plan_date) DO UPDATE SET
         meals = $3, total_calories = $4, total_protein_g = $5,
         total_carbs_g = $6, total_fat_g = $7, ai_generated = TRUE
       RETURNING *`,
      [
        userId,
        day.date,
        JSON.stringify(day.meals),
        day.total_calories,
        day.total_protein_g,
        day.total_carbs_g,
        day.total_fat_g,
      ],
    );
    saved.push({ ...r[0], notes: day.notes });
  }

  return { plans: saved, week: weekPlan };
}

async function listPlans(userId, limit = 7) {
  const { rows } = await db.query(
    `SELECT id, plan_date, meals, total_calories, total_protein_g, total_carbs_g, total_fat_g, ai_generated, created_at
     FROM meal_plans
     WHERE user_id = $1
     ORDER BY plan_date DESC
     LIMIT $2`,
    [userId, limit],
  );
  return rows;
}

module.exports = { generatePlan, listPlans };
