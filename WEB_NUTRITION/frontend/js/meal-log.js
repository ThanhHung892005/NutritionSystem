requireAuth();

const user = getUser();
document.getElementById("navUserName").textContent =
  user?.full_name || user?.email || "—";
document.getElementById("logoutBtn").addEventListener("click", () => {
  clearSession();
  window.location.href = "auth.html";
});

const today = new Date().toISOString().slice(0, 10);
document.getElementById("dateSelector").value = today;
document.getElementById("mealDate").value = today;

const MEAL_LABELS = {
  breakfast: "🌅 Bữa sáng",
  lunch: "☀️ Bữa trưa",
  dinner: "🌙 Bữa tối",
  snack: "🍎 Ăn vặt",
};

const DISEASE_MAP = {
  diabetes_t2: "diabetes",
  hypertension: "hypertension",
  gout: "gout",
  kidney: "kidney",
  celiac: "celiac",
};

let selectedFoodId = null;
let userDiseases = [];
let searchTimer = null;

// Load user diseases from profile
async function loadProfile() {
  try {
    const profile = await api.profile.get();
    userDiseases = (profile.diseases || [])
      .map((d) => DISEASE_MAP[d])
      .filter(Boolean);
  } catch {
    // no profile yet
  }
}

// Mode toggle
document.getElementById("btnModeSearch").addEventListener("click", () => {
  document.getElementById("btnModeSearch").classList.add("is-active");
  document.getElementById("btnModeCustom").classList.remove("is-active");
  document.getElementById("modeSearch").hidden = false;
  document.getElementById("modeCustom").hidden = true;
  selectedFoodId = null;
  document.getElementById("selectedFoodName").textContent = "";
});

document.getElementById("btnModeCustom").addEventListener("click", () => {
  document.getElementById("btnModeCustom").classList.add("is-active");
  document.getElementById("btnModeSearch").classList.remove("is-active");
  document.getElementById("modeCustom").hidden = false;
  document.getElementById("modeSearch").hidden = true;
  selectedFoodId = null;
});

// Food search with debounce
document.getElementById("foodSearch").addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  const q = e.target.value.trim();
  if (q.length < 1) {
    document.getElementById("foodResults").hidden = true;
    return;
  }
  searchTimer = setTimeout(() => searchFoods(q), 300);
});

async function searchFoods(q) {
  try {
    const params = { search: q, limit: 15 };
    if (userDiseases.length) params.disease = userDiseases[0];
    const data = await api.foods.search(params);
    renderFoodResults(data.foods || []);
  } catch {
    // silent
  }
}

function renderFoodResults(foods) {
  const container = document.getElementById("foodResults");
  if (!foods.length) {
    container.hidden = true;
    return;
  }
  container.innerHTML = foods
    .map(
      (f) => `
    <div class="food-result-item" data-id="${f.id}" data-name="${f.name}" data-cal="${f.calories}">
      <span class="food-result-name">${f.name}</span>
      <span class="food-result-cal">${f.calories} kcal/100g</span>
    </div>
  `,
    )
    .join("");
  container.hidden = false;

  container.querySelectorAll(".food-result-item").forEach((item) => {
    item.addEventListener("click", () => {
      selectedFoodId = item.dataset.id;
      document.getElementById("foodSearch").value = item.dataset.name;
      document.getElementById("selectedFoodName").textContent =
        `✓ ${item.dataset.name} · ${item.dataset.cal} kcal/100g`;
      container.hidden = true;
    });
  });
}

// Hide dropdown on outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".food-search-wrap")) {
    document.getElementById("foodResults").hidden = true;
  }
});

// Date selector changes reload logs
document.getElementById("dateSelector").addEventListener("change", (e) => {
  document.getElementById("mealDate").value = e.target.value;
  loadLogs(e.target.value);
});

function showError(msg) {
  const el = document.getElementById("mealError");
  el.textContent = msg;
  el.hidden = false;
  setTimeout(() => (el.hidden = true), 4000);
}

// Add meal
document.getElementById("addMealBtn").addEventListener("click", async () => {
  const isSearch = !document.getElementById("modeSearch").hidden;
  const mealType = document.getElementById("mealType").value;
  const amountG = parseFloat(document.getElementById("amountG").value);
  const loggedAt = document.getElementById("mealDate").value;
  const btn = document.getElementById("addMealBtn");

  let payload = { mealType, amountG, loggedAt };

  if (isSearch) {
    if (!selectedFoodId) {
      showError("Vui lòng chọn thực phẩm từ danh sách");
      return;
    }
    payload.foodId = selectedFoodId;
    payload.foodName = document.getElementById("foodSearch").value.trim();
  } else {
    const name = document.getElementById("customName").value.trim();
    const cal = parseFloat(document.getElementById("customCal").value);
    if (!name) {
      showError("Vui lòng nhập tên món ăn");
      return;
    }
    if (!cal || cal < 0) {
      showError("Vui lòng nhập calo hợp lệ");
      return;
    }
    payload.foodName = name;
    payload.calories = cal;
  }

  btn.disabled = true;
  btn.textContent = "Đang lưu...";
  try {
    await api.mealLog.add(payload);
    // Reset form
    document.getElementById("foodSearch").value = "";
    document.getElementById("selectedFoodName").textContent = "";
    document.getElementById("customName").value = "";
    document.getElementById("customCal").value = "";
    document.getElementById("amountG").value = "100";
    selectedFoodId = null;
    await loadLogs(loggedAt);
  } catch (err) {
    showError(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Thêm vào nhật ký";
  }
});

async function loadLogs(date) {
  const d = date || document.getElementById("dateSelector").value || today;
  try {
    const data = await api.mealLog.list({ date: d });
    renderTotals(data.totals || {});
    renderGroups(data.logs || []);
  } catch {
    // silent
  }
}

function renderTotals(t) {
  document.getElementById("totalCal").textContent = Math.round(t.calories || 0);
  document.getElementById("totalProtein").textContent = (
    t.protein_g || 0
  ).toFixed(1);
  document.getElementById("totalCarbs").textContent = (t.carbs_g || 0).toFixed(
    1,
  );
  document.getElementById("totalFat").textContent = (t.fat_g || 0).toFixed(1);
}

function renderGroups(logs) {
  const container = document.getElementById("mealLogList");
  if (!logs.length) {
    container.innerHTML =
      '<div class="meal-log-empty">Chưa có gì được ghi lại cho ngày này.</div>';
    return;
  }

  const groups = {};
  ["breakfast", "lunch", "dinner", "snack"].forEach((k) => (groups[k] = []));
  logs.forEach((l) => {
    if (groups[l.meal_type]) groups[l.meal_type].push(l);
  });

  container.innerHTML = Object.entries(groups)
    .filter(([, items]) => items.length)
    .map(([type, items]) => {
      const groupCal = items
        .reduce((s, i) => s + parseFloat(i.calories), 0)
        .toFixed(0);
      return `
      <div class="meal-group">
        <div class="meal-group__header">
          <span class="meal-group__title">${MEAL_LABELS[type]}</span>
          <span class="meal-group__cal">${groupCal} kcal</span>
        </div>
        <div class="meal-list">
          ${items
            .map(
              (item) => `
            <div class="meal-item" id="mitem-${item.id}">
              <div>
                <div class="meal-name">${item.food_name}${item.amount_g ? ` · ${item.amount_g}g` : ""}</div>
                <div class="meal-cal">${parseFloat(item.calories).toFixed(0)} kcal${item.protein_g > 0 ? ` · ${parseFloat(item.protein_g).toFixed(1)}g đạm` : ""}</div>
              </div>
              <div class="meal-item-actions">
                <div class="meal-macro">
                  ${item.protein_g > 0 ? '<div class="macro-dot protein" title="Đạm"></div>' : ""}
                  ${item.carbs_g > 0 ? '<div class="macro-dot carbs" title="Tinh bột"></div>' : ""}
                  ${item.fat_g > 0 ? '<div class="macro-dot fat" title="Chất béo"></div>' : ""}
                </div>
                <button class="meal-delete-btn" onclick="deleteMealLog('${item.id}')" aria-label="Xóa">×</button>
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
}

window.deleteMealLog = async function (id) {
  try {
    await api.mealLog.delete(id);
    const date = document.getElementById("dateSelector").value;
    await loadLogs(date);
  } catch (err) {
    showError(err.message);
  }
};

async function init() {
  await loadProfile();
  await loadLogs(today);
}

init();
