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

const MEAL_LABEL = {
  breakfast: "Bữa sáng",
  lunch: "Bữa trưa",
  dinner: "Bữa tối",
  snack: "Ăn vặt",
};

function buildRestrictions(diseases) {
  const r = [];
  if (diseases.includes("diabetes_t2"))
    r.push(
      "- Tiểu đường: tránh đường, cơm trắng, chuối chín, nước ngọt. Ưu tiên GI thấp (gạo lứt, yến mạch, rau xanh).",
    );
  if (diseases.includes("hypertension"))
    r.push(
      "- Tăng huyết áp: hạn chế muối (<1500mg natri/ngày), tránh đồ ăn chế biến sẵn, mì gói.",
    );
  if (diseases.includes("gout"))
    r.push(
      "- Gout: tránh hải sản giàu purin, nội tạng, bia rượu, thịt đỏ nhiều. Ưu tiên đậu hũ, rau xanh, sữa ít béo.",
    );
  if (diseases.includes("kidney"))
    r.push(
      "- Bệnh thận: hạn chế protein (<0.8g/kg), kali, phosphate. Tránh gạo lứt, yến mạch, chuối. Ưu tiên gạo trắng.",
    );
  if (diseases.includes("celiac"))
    r.push(
      "- Celiac: tuyệt đối không gluten. Loại trừ lúa mì, yến mạch, bánh mì, mì. Dùng gạo, khoai, ngô.",
    );
  if (diseases.includes("heart"))
    r.push(
      "- Tim mạch: tránh chất béo bão hòa, mỡ động vật. Ưu tiên dầu ô liu, cá hồi, rau xanh, hạt.",
    );
  return r;
}

function formatMealPlansBlock(plans) {
  if (!plans.length) return "";
  const lines = ["=== THỰC ĐƠN TUẦN NÀY ==="];
  for (const p of plans) {
    lines.push(
      `\n[${p.plan_date}] — ${p.total_calories} kcal | Đạm: ${p.total_protein_g}g | Tinh bột: ${p.total_carbs_g}g | Béo: ${p.total_fat_g}g`,
    );
    const meals = typeof p.meals === "string" ? JSON.parse(p.meals) : p.meals;
    for (const [type, items] of Object.entries(meals)) {
      if (!items?.length) continue;
      lines.push(`  ${MEAL_LABEL[type] || type}:`);
      for (const item of items) {
        lines.push(
          `    - ${item.name} (${item.amount || ""}) ~ ${item.calories} kcal`,
        );
      }
    }
  }
  return lines.join("\n");
}

function formatMealLogsBlock(logs) {
  if (!logs.length) return "";
  const lines = ["=== NHẬT KÝ ĂN HÔM NAY ==="];
  const groups = {};
  for (const l of logs) {
    if (!groups[l.meal_type]) groups[l.meal_type] = [];
    groups[l.meal_type].push(l);
  }
  for (const [type, items] of Object.entries(groups)) {
    lines.push(`  ${MEAL_LABEL[type] || type}:`);
    for (const item of items) {
      lines.push(
        `    - ${item.food_name}${item.amount_g ? ` ${item.amount_g}g` : ""} ~ ${parseFloat(item.calories).toFixed(0)} kcal`,
      );
    }
  }
  const total = logs.reduce((s, l) => s + parseFloat(l.calories), 0);
  lines.push(`  Tổng hôm nay: ${total.toFixed(0)} kcal`);
  return lines.join("\n");
}

function buildSystemPrompt(profile, plans, logs) {
  const diseases = profile.diseases || [];
  const diseaseStr = diseases.map((d) => DISEASE_LABELS[d] || d).join(", ");
  const targetCal =
    profile.goal === "lose_weight"
      ? Math.round(profile.tdee - 500)
      : profile.goal === "gain_muscle"
        ? Math.round(profile.tdee + 300)
        : Math.round(profile.tdee);

  const restrictions = buildRestrictions(diseases);

  const profileBlock = `=== HỒ SƠ SỨC KHỎE NGƯỜI DÙNG ===
- Tuổi: ${profile.age}, Giới tính: ${profile.gender === "male" ? "Nam" : "Nữ"}
- Cân nặng: ${profile.weight_kg}kg, Chiều cao: ${profile.height_cm}cm
- BMI: ${profile.bmi}
- Mức vận động: ${ACTIVITY_LABEL[profile.activity_level] || profile.activity_level}
- Mục tiêu: ${GOAL_LABEL[profile.goal] || profile.goal}
- TDEE: ${profile.tdee} kcal/ngày
- Calo mục tiêu: ${targetCal} kcal/ngày
- Bệnh lý: ${diseaseStr || "Không có"}
${restrictions.length ? "\nHẠN CHẾ NGHIÊM NGẶT:\n" + restrictions.join("\n") : ""}`;

  const plansBlock = formatMealPlansBlock(plans);
  const logsBlock = formatMealLogsBlock(logs);

  return `Bạn là Trợ lý Dinh dưỡng AI của NutritionSystem — chuyên gia dinh dưỡng thân thiện, am hiểu y học, nói tiếng Việt tự nhiên.

${profileBlock}

${plansBlock}

${logsBlock}

=== NGUYÊN TẮC ===
1. Luôn trả lời tiếng Việt, cá nhân hóa theo dữ liệu thực của người dùng.
2. Khi được hỏi về thực đơn hoặc nhật ký ăn: đối chiếu với bệnh lý và hạn chế, chỉ ra cụ thể món nào không phù hợp và lý do, gợi ý thay thế phù hợp.
3. Không đưa ra chẩn đoán bệnh. Với vấn đề y tế nghiêm trọng, khuyên gặp bác sĩ.
4. Nếu câu hỏi không liên quan dinh dưỡng/sức khỏe/thực phẩm: lịch sự từ chối và hướng về chủ đề dinh dưỡng.
5. Câu trả lời ngắn gọn, rõ ràng. Dùng danh sách khi liệt kê thực phẩm hoặc các bước.`;
}

function buildNoProfilePrompt() {
  return `Bạn là Trợ lý Dinh dưỡng AI của NutritionSystem. Người dùng chưa điền hồ sơ sức khỏe.
Trả lời các câu hỏi dinh dưỡng chung bằng tiếng Việt. Khuyến khích người dùng điền hồ sơ tại trang "Hồ sơ" để nhận tư vấn cá nhân hóa chính xác hơn.
Không đưa ra gợi ý calo hay macro cụ thể khi chưa biết thông tin cơ thể người dùng.`;
}

function sanitizeHistory(history) {
  return (history || []).filter(
    (h) =>
      h &&
      ["user", "model"].includes(h.role) &&
      Array.isArray(h.parts) &&
      h.parts[0]?.text,
  );
}

async function sendMessage(userId, message, history = []) {
  const [profileResult, plansResult, logsResult] = await Promise.all([
    db.query("SELECT * FROM health_profiles WHERE user_id = $1", [userId]),
    db.query(
      "SELECT * FROM meal_plans WHERE user_id = $1 ORDER BY plan_date DESC LIMIT 7",
      [userId],
    ),
    db.query(
      "SELECT * FROM meal_logs WHERE user_id = $1 AND logged_at = CURRENT_DATE ORDER BY created_at ASC",
      [userId],
    ),
  ]);

  const systemInstruction = profileResult.rows.length
    ? buildSystemPrompt(
        profileResult.rows[0],
        plansResult.rows,
        logsResult.rows,
      )
    : buildNoProfilePrompt();

  let reply;
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction,
    });
    const chat = model.startChat({ history: sanitizeHistory(history) });
    const result = await chat.sendMessage(message);
    reply = result.response.text();
  } catch (err) {
    console.error("Gemini chatbot error:", err.message);
    throw Object.assign(
      new Error("Không thể kết nối AI. Vui lòng thử lại sau."),
      { status: 503 },
    );
  }

  // Lưu cả 2 lượt vào DB (fire-and-forget, không block response)
  db.query(
    "INSERT INTO chat_messages (user_id, role, message) VALUES ($1, 'user', $2), ($1, 'model', $3)",
    [userId, message, reply],
  ).catch((err) => console.error("Save chat_messages error:", err.message));

  return { reply };
}

async function getHistory(userId, limit = 40) {
  const { rows } = await db.query(
    `SELECT role, message, created_at
     FROM chat_messages
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit],
  );
  // Đảo ngược để trả về thứ tự ASC (cũ → mới)
  return rows.reverse();
}

async function clearHistory(userId) {
  await db.query("DELETE FROM chat_messages WHERE user_id = $1", [userId]);
}

module.exports = { sendMessage, getHistory, clearHistory };
