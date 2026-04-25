requireAuth();

const user = getUser();
document.getElementById("navUserName").textContent =
  user?.full_name || user?.email || "—";
document.getElementById("logoutBtn").addEventListener("click", () => {
  clearSession();
  window.location.href = "auth.html";
});

// Set default start date to today
document.getElementById("startDate").value = new Date()
  .toISOString()
  .slice(0, 10);

const MEAL_LABELS = {
  breakfast: "🌅 Bữa sáng",
  lunch: "☀️ Bữa trưa",
  dinner: "🌙 Bữa tối",
};

const GOAL_LABEL = {
  lose_weight: "Giảm cân",
  maintain: "Duy trì",
  gain_muscle: "Tăng cơ",
};

const DISEASE_LABEL = {
  diabetes_t2: "Tiểu đường",
  hypertension: "Huyết áp",
  heart: "Tim mạch",
  gout: "Gout",
  kidney: "Thận",
  celiac: "Celiac",
};

let currentWeek = null; // array of day objects
let currentDayIndex = 0;

// Load profile info
async function loadProfile() {
  try {
    const calc = await api.profile.calculate();
    const profile = await api.profile.get();

    const targetCal =
      calc.goal === "lose_weight"
        ? Math.round(calc.tdee - 500)
        : calc.goal === "gain_muscle"
          ? Math.round(calc.tdee + 300)
          : Math.round(calc.tdee);

    document.getElementById("plannerProfileInfo").textContent =
      `Mục tiêu: ${GOAL_LABEL[calc.goal] || calc.goal} · ${targetCal.toLocaleString("vi-VN")} kcal/ngày`;

    const diseases = profile.diseases || [];
    const tagsEl = document.getElementById("diseasesTags");
    if (diseases.length) {
      tagsEl.innerHTML = diseases
        .map((d) => `<span class="tag">${DISEASE_LABEL[d] || d}</span>`)
        .join("");
    }
  } catch {
    document.getElementById("plannerProfileInfo").textContent =
      "Chưa có hồ sơ sức khỏe.";
  }
}

// Generate plan
document.getElementById("generateBtn").addEventListener("click", async () => {
  const btn = document.getElementById("generateBtn");
  const loading = document.getElementById("plannerLoading");
  const errorEl = document.getElementById("plannerError");
  const startDate = document.getElementById("startDate").value;

  btn.disabled = true;
  loading.classList.add("is-visible");
  errorEl.hidden = true;

  try {
    const result = await api.mealPlan.generate({ startDate });
    currentWeek = result.week.days;
    currentDayIndex = 0;
    document.getElementById("plannerWeek").hidden = false;
    renderDay(currentDayIndex);
    await loadHistory();
  } catch (err) {
    errorEl.textContent = err.message || "Có lỗi xảy ra. Vui lòng thử lại.";
    errorEl.hidden = false;
  } finally {
    btn.disabled = false;
    loading.classList.remove("is-visible");
  }
});

// Day navigation
document.getElementById("prevDay").addEventListener("click", () => {
  if (!currentWeek || currentDayIndex <= 0) return;
  currentDayIndex--;
  renderDay(currentDayIndex);
});

document.getElementById("nextDay").addEventListener("click", () => {
  if (!currentWeek || currentDayIndex >= currentWeek.length - 1) return;
  currentDayIndex++;
  renderDay(currentDayIndex);
});

function renderDay(idx) {
  const day = currentWeek[idx];
  if (!day) return;

  // Update nav buttons
  document.getElementById("prevDay").disabled = idx === 0;
  document.getElementById("nextDay").disabled = idx === currentWeek.length - 1;

  // Day indicator
  const d = new Date(day.date);
  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  document.getElementById("dayIndicator").textContent =
    `Ngày ${idx + 1}/7 — ${weekdays[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

  // Render card
  const card = document.getElementById("dayCard");
  const meals = day.meals || {};

  const mealSections = Object.entries(MEAL_LABELS)
    .filter(([key]) => meals[key]?.length)
    .map(([key, label]) => {
      const items = meals[key];
      const sectionCal = items
        .reduce((s, i) => s + (i.calories || 0), 0)
        .toFixed(0);
      return `
      <div class="meal-section">
        <div class="meal-section__header">
          <span class="meal-section__title">${label}</span>
          <span class="meal-section__cal">${sectionCal} kcal</span>
        </div>
        <div class="meal-list">
          ${items
            .map(
              (item) => `
            <div class="meal-item">
              <div>
                <div class="meal-name">${item.name}${item.amount ? ` · ${item.amount}` : ""}</div>
                <div class="meal-cal">${item.calories || 0} kcal${item.protein_g ? ` · ${item.protein_g}g đạm` : ""}</div>
              </div>
              <div class="meal-macro">
                ${item.protein_g > 0 ? '<div class="macro-dot protein" title="Đạm"></div>' : ""}
                ${item.carbs_g > 0 ? '<div class="macro-dot carbs" title="Tinh bột"></div>' : ""}
                ${item.fat_g > 0 ? '<div class="macro-dot fat" title="Chất béo"></div>' : ""}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `;
    })
    .join("");

  card.innerHTML = `
    <div class="day-macros">
      <div class="day-macro-card">
        <div class="day-macro-card__label">Calo</div>
        <div class="day-macro-card__value">${(day.total_calories || 0).toLocaleString("vi-VN")}</div>
        <div class="day-macro-card__unit">kcal</div>
      </div>
      <div class="day-macro-card">
        <div class="day-macro-card__label">Đạm</div>
        <div class="day-macro-card__value">${day.total_protein_g || 0}</div>
        <div class="day-macro-card__unit">g</div>
      </div>
      <div class="day-macro-card">
        <div class="day-macro-card__label">Tinh bột</div>
        <div class="day-macro-card__value">${day.total_carbs_g || 0}</div>
        <div class="day-macro-card__unit">g</div>
      </div>
      <div class="day-macro-card">
        <div class="day-macro-card__label">Chất béo</div>
        <div class="day-macro-card__value">${day.total_fat_g || 0}</div>
        <div class="day-macro-card__unit">g</div>
      </div>
    </div>
    <div class="day-meals">${mealSections}</div>
    ${day.notes ? `<div class="day-notes">💡 ${day.notes}</div>` : ""}
  `;
}

// Load saved history
async function loadHistory() {
  try {
    const data = await api.mealPlan.list({ limit: 10 });
    const plans = data.plans || [];
    const list = document.getElementById("plannerHistoryList");

    if (!plans.length) {
      list.innerHTML =
        '<p style="color: var(--color-muted); font-size: 14px;">Chưa có thực đơn nào được tạo.</p>';
      return;
    }

    // Group plans by week (consecutive days)
    const sorted = [...plans].sort((a, b) =>
      a.plan_date.localeCompare(b.plan_date),
    );

    // Show individual days grouped roughly
    const dateGroups = groupByWeek(sorted);

    list.innerHTML = dateGroups
      .map(
        (group, gi) => `
      <div class="planner-history-item">
        <div class="planner-history-dates">
          ${formatDate(group[0].plan_date)} — ${formatDate(group[group.length - 1].plan_date)}
          <br><span style="font-size:11px">${group.length} ngày</span>
        </div>
        <div class="planner-history-cals">
          ${Math.round(group.reduce((s, p) => s + parseFloat(p.total_calories || 0), 0) / group.length).toLocaleString("vi-VN")}
          <span>kcal/ngày tb</span>
        </div>
        <button class="planner-history-view" onclick="viewHistoryGroup(${gi})">Xem lại</button>
      </div>
    `,
      )
      .join("");

    window._historyGroups = dateGroups;
  } catch {
    // silent
  }
}

function groupByWeek(plans) {
  if (!plans.length) return [];
  const groups = [];
  let current = [plans[0]];
  for (let i = 1; i < plans.length; i++) {
    const prev = new Date(plans[i - 1].plan_date);
    const curr = new Date(plans[i].plan_date);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff <= 1) {
      current.push(plans[i]);
    } else {
      groups.push(current);
      current = [plans[i]];
    }
  }
  groups.push(current);
  return groups.reverse();
}

window.viewHistoryGroup = function (groupIdx) {
  const group = window._historyGroups?.[groupIdx];
  if (!group) return;

  currentWeek = group.map((p) => ({
    date: p.plan_date,
    meals: typeof p.meals === "string" ? JSON.parse(p.meals) : p.meals,
    total_calories: p.total_calories,
    total_protein_g: p.total_protein_g,
    total_carbs_g: p.total_carbs_g,
    total_fat_g: p.total_fat_g,
    notes: null,
  }));
  currentDayIndex = 0;
  document.getElementById("plannerWeek").hidden = false;
  renderDay(0);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

async function init() {
  await loadProfile();
  await loadHistory();
}

init();
