requireAuth();

const user = getUser();
document.getElementById("navUserName").textContent =
  user?.full_name || user?.email || "—";
document.getElementById("logoutBtn").addEventListener("click", () => {
  clearSession();
  window.location.href = "auth.html";
});

// Set default date to today
document.getElementById("loggedAt").value = new Date()
  .toISOString()
  .slice(0, 10);

let allLogs = [];

function renderChart(logs) {
  const chart = document.getElementById("weightChart");
  const labels = document.getElementById("weightLabels");
  chart.innerHTML = "";
  labels.innerHTML = "";

  if (!logs.length) return;

  // Show chart card
  document.getElementById("chartCard").hidden = false;

  const weights = logs.map((l) => parseFloat(l.weight_kg));
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;

  // Show at most 20 bars
  const display = logs.slice(0, 20).reverse();

  display.forEach((log, i) => {
    const pct = 20 + ((parseFloat(log.weight_kg) - minW) / range) * 75;

    const bar = document.createElement("div");
    bar.className = "weight-bar" + (i === display.length - 1 ? " current" : "");
    bar.style.height = `${pct}%`;
    bar.title = `${log.weight_kg} kg — ${log.logged_at}`;
    chart.appendChild(bar);

    const lbl = document.createElement("span");
    lbl.className = "weight-label-item";
    const d = new Date(log.logged_at);
    lbl.textContent = `${d.getDate()}/${d.getMonth() + 1}`;
    labels.appendChild(lbl);
  });
}

function renderStats(logs) {
  if (!logs.length) return;
  const current = parseFloat(logs[0].weight_kg);
  const start = parseFloat(logs[logs.length - 1].weight_kg);
  const change = current - start;

  document.getElementById("statCurrent").textContent = current.toFixed(1);
  document.getElementById("statStart").textContent = start.toFixed(1);
  const changeEl = document.getElementById("statChange");
  changeEl.textContent = (change >= 0 ? "+" : "") + change.toFixed(1);
  changeEl.className =
    "dash-stat-card__value " +
    (change < 0 ? "stat-change-down" : change > 0 ? "stat-change-up" : "");
}

function renderLogList(logs) {
  const list = document.getElementById("logList");
  if (!logs.length) {
    list.innerHTML =
      '<div class="tracker-empty">Chưa có dữ liệu. Hãy ghi lại cân nặng đầu tiên!</div>';
    return;
  }
  list.innerHTML = logs
    .map(
      (log) => `
    <div class="tracker-log-row" id="row-${log.id}">
      <span class="tracker-log-date">${formatDate(log.logged_at)}</span>
      <span class="tracker-log-weight">${parseFloat(log.weight_kg).toFixed(1)} kg</span>
      <span class="tracker-log-note">${log.note || ""}</span>
      <button class="tracker-log-delete" onclick="deleteLog('${log.id}')" aria-label="Xóa">Xóa</button>
    </div>
  `,
    )
    .join("");
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

async function loadLogs() {
  try {
    const data = await api.weightLog.list({ limit: 30 });
    allLogs = data.logs || [];
    renderStats(allLogs);
    renderChart(allLogs);
    renderLogList(allLogs);
  } catch {
    // silent fail — empty state shown by default
  }
}

window.deleteLog = async function (id) {
  if (!confirm("Xóa log này?")) return;
  try {
    await api.weightLog.delete(id);
    document.getElementById(`row-${id}`)?.remove();
    allLogs = allLogs.filter((l) => l.id !== id);
    renderStats(allLogs);
    renderChart(allLogs);
    if (!allLogs.length) renderLogList([]);
  } catch (err) {
    showError(err.message);
  }
};

function showError(msg) {
  const el = document.getElementById("trackerError");
  el.textContent = msg;
  el.hidden = false;
  setTimeout(() => (el.hidden = true), 4000);
}

document.getElementById("weightForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("saveWeightBtn");
  const weightKg = parseFloat(document.getElementById("weightKg").value);
  const loggedAt = document.getElementById("loggedAt").value;
  const note = document.getElementById("weightNote").value.trim();

  if (!weightKg || weightKg < 20 || weightKg > 500) {
    showError("Cân nặng phải từ 20 đến 500 kg");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Đang lưu...";
  try {
    await api.weightLog.add({ weightKg, loggedAt, note });
    document.getElementById("weightKg").value = "";
    document.getElementById("weightNote").value = "";
    await loadLogs();
  } catch (err) {
    showError(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Lưu cân nặng";
  }
});

loadLogs();
