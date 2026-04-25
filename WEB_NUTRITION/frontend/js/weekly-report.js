requireAuth();

const user = getUser();
document.getElementById("navUserName").textContent =
  user?.full_name || user?.email || "—";
document.getElementById("logoutBtn").addEventListener("click", () => {
  clearSession();
  window.location.href = "auth.html";
});

function getMondayOfWeek(dateStr) {
  const d = dateStr ? new Date(dateStr + "T00:00:00") : new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function offsetWeek(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatWeekRange(start, end) {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  return `${s.getDate()}/${s.getMonth() + 1} – ${e.getDate()}/${e.getMonth() + 1}/${e.getFullYear()}`;
}

const currentMonday = getMondayOfWeek();
let weekStart = currentMonday;

function updateWeekNav() {
  document.getElementById("weekRangeLabel").textContent = formatWeekRange(
    weekStart,
    offsetWeek(weekStart, 6),
  );
  document.getElementById("nextWeekBtn").disabled = weekStart >= currentMonday;
}

document.getElementById("prevWeekBtn").addEventListener("click", () => {
  weekStart = offsetWeek(weekStart, -7);
  load();
});

document.getElementById("nextWeekBtn").addEventListener("click", () => {
  weekStart = offsetWeek(weekStart, 7);
  load();
});

function renderSummary(data) {
  document.getElementById("statAvgCalories").textContent =
    data.avgDailyCalories.toLocaleString("vi-VN");
  document.getElementById("statTargetCalories").textContent =
    data.targetCalories.toLocaleString("vi-VN");
  document.getElementById("statAdherencePct").textContent =
    data.adherencePct + "%";
  document.getElementById("statDaysLogged").textContent =
    data.daysLogged + "/7 ngày";

  document.getElementById("macroProtein").textContent =
    data.macroAvg.protein_g + "g";
  document.getElementById("macroCarbs").textContent =
    data.macroAvg.carbs_g + "g";
  document.getElementById("macroFat").textContent = data.macroAvg.fat_g + "g";
}

function renderChart(days, targetCalories) {
  const grid = document.getElementById("reportBarGrid");
  grid.innerHTML = "";

  days.forEach((d) => {
    const col = document.createElement("div");
    col.className = "report-bar-col";

    const pct = targetCalories
      ? Math.min(100, (d.calories / targetCalories) * 100)
      : 0;
    const heightPct = Math.max(3, pct);

    let barClass = "report-bar is-empty";
    if (d.logged) {
      const ratio = d.calories / targetCalories;
      if (ratio >= 0.8) barClass = "report-bar is-good";
      else if (ratio >= 0.5) barClass = "report-bar is-ok";
      else barClass = "report-bar is-low";
    }

    col.innerHTML = `
      <span class="report-bar-cal">${d.logged ? d.calories.toLocaleString("vi-VN") : ""}</span>
      <div class="${barClass}" style="height:${heightPct}%" title="${d.logged ? d.calories + " kcal" : "Chưa log"}"></div>
      <span class="report-bar-label">${d.dayLabel}</span>
    `;
    grid.appendChild(col);
  });
}

function renderWeight(data) {
  const section = document.getElementById("weightSection");
  if (data.weightStart === null) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  document.getElementById("weightStart").textContent =
    data.weightStart.toFixed(1) + " kg";
  document.getElementById("weightEnd").textContent =
    data.weightEnd != null ? data.weightEnd.toFixed(1) + " kg" : "—";

  if (data.weightChange !== null) {
    const el = document.getElementById("weightChange");
    el.textContent =
      (data.weightChange >= 0 ? "+" : "") +
      data.weightChange.toFixed(1) +
      " kg";
    el.className =
      "dash-stat-card__value " +
      (data.weightChange < 0
        ? "stat-change-down"
        : data.weightChange > 0
          ? "stat-change-up"
          : "");
  }
}

function renderAdherence(pct) {
  const fill = document.getElementById("adherenceFill");
  document.getElementById("adherenceLabel").textContent =
    "Tuân thủ mục tiêu: " + pct + "%";

  if (pct >= 80) fill.style.background = "var(--color-forest)";
  else if (pct >= 50) fill.style.background = "var(--color-sage)";
  else fill.style.background = "var(--color-citrus)";

  setTimeout(() => {
    fill.style.width = Math.min(100, pct) + "%";
  }, 150);
}

async function load() {
  updateWeekNav();
  try {
    const data = await api.reports.weekly({ weekStart });
    renderSummary(data);
    renderChart(data.days, data.targetCalories);
    renderWeight(data);
    renderAdherence(data.adherencePct);
  } catch (err) {
    console.error("Lỗi tải báo cáo:", err.message);
  }
}

load();
