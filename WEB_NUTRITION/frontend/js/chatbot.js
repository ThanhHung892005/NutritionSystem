requireAuth();

const user = getUser();
document.getElementById("navUserName").textContent =
  user?.full_name || user?.email || "—";
document.getElementById("logoutBtn").addEventListener("click", () => {
  clearSession();
  window.location.href = "auth.html";
});

let conversationHistory = [];
let hasProfile = false;

const SUGGESTIONS_WITH_PROFILE = [
  "Kiểm tra thực đơn tuần này của tôi",
  "Hôm nay tôi ăn có ổn không?",
  "Tôi nên ăn gì để đạt mục tiêu?",
  "Thực phẩm nào phù hợp với sức khỏe của tôi?",
];

const SUGGESTIONS_NO_PROFILE = [
  "Thực phẩm nào giàu protein?",
  "Tôi nên ăn bao nhiêu calo mỗi ngày?",
  "Lợi ích của chế độ ăn ít tinh bột?",
  "Gợi ý bữa sáng lành mạnh",
];

function formatAiText(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getTime() {
  return new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function appendUserMessage(text) {
  const container = document.getElementById("chatMessages");
  const el = document.createElement("div");
  el.className = "chat-msg chat-msg--user";
  el.innerHTML = `
    <div class="chat-msg__bubble">${escapeHtml(text)}</div>
    <span class="chat-msg__time">${getTime()}</span>
  `;
  container.appendChild(el);
  scrollToBottom();
}

function appendAiMessage(text, variant = "") {
  const container = document.getElementById("chatMessages");
  const el = document.createElement("div");
  el.className = `chat-msg chat-msg--ai${variant ? " chat-msg--" + variant : ""}`;
  el.innerHTML = `
    <div class="chat-msg__bubble">${formatAiText(text)}</div>
    <span class="chat-msg__time">${getTime()}</span>
  `;
  container.appendChild(el);
  scrollToBottom();
}

function scrollToBottom() {
  const container = document.getElementById("chatMessages");
  container.scrollTop = container.scrollHeight;
}

function showWelcomeMessage() {
  const container = document.getElementById("chatMessages");
  if (container.children.length > 0) return;
  const el = document.createElement("div");
  el.className = "chat-msg chat-msg--ai chat-msg--welcome";
  el.innerHTML = `
    <div class="chat-msg__bubble">
      Xin chào! Tôi là Trợ lý Dinh dưỡng AI của NutritionSystem.<br><br>
      Tôi có thể giúp bạn kiểm tra thực đơn, gợi ý thực phẩm phù hợp với sức khỏe, và giải đáp mọi thắc mắc về dinh dưỡng.<br><br>
      Hãy hỏi tôi bất cứ điều gì!
    </div>
  `;
  container.appendChild(el);
}

function restoreUiFromHistory() {
  for (const turn of conversationHistory) {
    const text = turn.parts?.[0]?.text || "";
    if (turn.role === "user") appendUserMessage(text);
    else appendAiMessage(text);
  }
}

function renderChips(withProfile) {
  const chips = withProfile ? SUGGESTIONS_WITH_PROFILE : SUGGESTIONS_NO_PROFILE;
  const container = document.getElementById("chatChips");
  container.innerHTML = chips
    .map(
      (c) =>
        `<button class="chatbot-chip" type="button">${escapeHtml(c)}</button>`,
    )
    .join("");
  container.querySelectorAll(".chatbot-chip").forEach((btn) => {
    btn.addEventListener("click", () => handleSend(btn.textContent));
  });
}

async function loadProfileBadge() {
  try {
    const calc = await api.profile.calculate();
    const GOAL_VI = {
      lose_weight: "Giảm cân",
      maintain: "Duy trì",
      gain_muscle: "Tăng cơ",
    };
    const targetCal =
      calc.goal === "lose_weight"
        ? Math.round(calc.tdee - 500)
        : calc.goal === "gain_muscle"
          ? Math.round(calc.tdee + 300)
          : Math.round(calc.tdee);

    const badge = document.getElementById("chatProfileBadge");
    badge.textContent = `AI tư vấn theo hồ sơ: ${GOAL_VI[calc.goal] || ""} · ${targetCal.toLocaleString("vi-VN")} kcal/ngày`;
    badge.hidden = false;
    hasProfile = true;
  } catch (err) {
    if (err.status === 404 || err.status === 400) {
      document.getElementById("chatNoProfileBanner").hidden = false;
    }
  }
}

async function handleSend(text) {
  const message = (text || "").trim();
  if (!message) return;

  const inputEl = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSendBtn");
  const typingEl = document.getElementById("chatTyping");

  appendUserMessage(message);
  inputEl.value = "";
  inputEl.style.height = "auto";
  sendBtn.disabled = true;

  typingEl.hidden = false;
  typingEl.removeAttribute("aria-hidden");
  scrollToBottom();

  try {
    const result = await api.chatbot.send({
      message,
      history: conversationHistory,
    });

    typingEl.hidden = true;
    typingEl.setAttribute("aria-hidden", "true");

    appendAiMessage(result.reply);

    conversationHistory.push(
      { role: "user", parts: [{ text: message }] },
      { role: "model", parts: [{ text: result.reply }] },
    );

    if (conversationHistory.length > 40) {
      conversationHistory = conversationHistory.slice(-40);
    }
  } catch (err) {
    typingEl.hidden = true;
    typingEl.setAttribute("aria-hidden", "true");
    appendAiMessage(err.message || "Có lỗi xảy ra. Vui lòng thử lại.", "error");
  } finally {
    sendBtn.disabled = !inputEl.value.trim();
  }
}

// Input auto-resize + enable/disable send button
const inputEl = document.getElementById("chatInput");
inputEl.addEventListener("input", () => {
  document.getElementById("chatSendBtn").disabled = !inputEl.value.trim();
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 140) + "px";
});

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (!document.getElementById("chatSendBtn").disabled) {
      handleSend(inputEl.value);
    }
  }
});

document.getElementById("chatSendBtn").addEventListener("click", () => {
  handleSend(inputEl.value);
});

document.getElementById("chatClearBtn").addEventListener("click", async () => {
  try {
    await api.chatbot.clearHistory();
  } catch {
    // silent — xóa UI dù API fail
  }
  conversationHistory = [];
  document.getElementById("chatMessages").innerHTML = "";
  showWelcomeMessage();
});

// ─── Meal Review Panel ─────────────────────────────────────────────────────

const MEAL_SECTIONS = [
  { key: "breakfast", label: "🌅 Bữa sáng" },
  { key: "lunch", label: "☀️ Bữa trưa" },
  { key: "dinner", label: "🌙 Bữa tối" },
  { key: "snack", label: "🍎 Ăn vặt" },
];

function createMealRow(sectionKey) {
  const row = document.createElement("div");
  row.className = "meal-review-row";
  row.innerHTML = `
    <input type="text" class="meal-review-input meal-review-input--name"
      placeholder="Tên món ăn" maxlength="100" aria-label="Tên món">
    <input type="text" class="meal-review-input meal-review-input--qty"
      placeholder="VD: 200g, 1 bát, 2 chén" maxlength="30" aria-label="Số lượng (VD: 200g, 1 bát, 2 chén)">
    <button type="button" class="meal-review-row__delete" aria-label="Xóa món">✕</button>
  `;
  row
    .querySelector(".meal-review-row__delete")
    .addEventListener("click", () => {
      const section = row.closest(".meal-review-section");
      row.remove();
      // Giữ ít nhất 1 hàng
      if (!section.querySelector(".meal-review-row")) {
        section
          .querySelector(".meal-review-rows")
          .appendChild(createMealRow(sectionKey));
      }
    });
  return row;
}

function buildMealReviewPanel() {
  const panel = document.getElementById("mealReviewPanel");
  const body = panel.querySelector(".meal-review-body");
  body.innerHTML = "";

  for (const { key, label } of MEAL_SECTIONS) {
    const section = document.createElement("div");
    section.className = "meal-review-section";
    section.dataset.meal = key;
    section.innerHTML = `
      <div class="meal-review-section__label">${label}</div>
      <div class="meal-review-rows"></div>
      <button type="button" class="meal-review-add">+ Thêm món</button>
    `;
    const rowsEl = section.querySelector(".meal-review-rows");
    rowsEl.appendChild(createMealRow(key));
    section.querySelector(".meal-review-add").addEventListener("click", () => {
      rowsEl.appendChild(createMealRow(key));
    });
    body.appendChild(section);
  }
}

function buildMealReviewMessage() {
  const EMOJI = { breakfast: "🌅", lunch: "☀️", dinner: "🌙", snack: "🍎" };
  const LABEL = {
    breakfast: "Bữa sáng",
    lunch: "Bữa trưa",
    dinner: "Bữa tối",
    snack: "Ăn vặt",
  };
  const lines = ["Nhờ AI đánh giá bữa ăn hôm nay của tôi:"];

  let hasAnyFood = false;
  for (const { key } of MEAL_SECTIONS) {
    const section = document.querySelector(
      `.meal-review-section[data-meal="${key}"]`,
    );
    const rows = section.querySelectorAll(".meal-review-row");
    const items = [];
    for (const row of rows) {
      const name = row.querySelector(".meal-review-input--name").value.trim();
      const qty = row.querySelector(".meal-review-input--qty").value.trim();
      if (name) {
        items.push(qty ? `${name} (${qty})` : name);
        hasAnyFood = true;
      }
    }
    if (items.length) {
      lines.push(`${EMOJI[key]} ${LABEL[key]}: ${items.join(", ")}`);
    }
  }

  if (!hasAnyFood) return null;
  lines.push(
    "Dựa trên hồ sơ và bệnh lý của tôi, bữa ăn này có phù hợp không? Cần điều chỉnh gì?",
  );
  return lines.join("\n");
}

function toggleMealPanel(forceClose = false) {
  const panel = document.getElementById("mealReviewPanel");
  const btn = document.getElementById("toggleMealReview");
  const isOpen = !panel.hidden;
  if (forceClose || isOpen) {
    panel.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    btn.classList.remove("meal-review-toggle--active");
  } else {
    panel.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    btn.classList.add("meal-review-toggle--active");
  }
}

document.getElementById("toggleMealReview").addEventListener("click", () => {
  toggleMealPanel();
});

document.getElementById("mealReviewClose").addEventListener("click", () => {
  toggleMealPanel(true);
});

document.getElementById("mealReviewSubmit").addEventListener("click", () => {
  const msg = buildMealReviewMessage();
  if (!msg) {
    alert("Vui lòng nhập ít nhất một món ăn.");
    return;
  }
  toggleMealPanel(true);
  buildMealReviewPanel(); // reset form
  handleSend(msg);
});

// ─── Init ──────────────────────────────────────────────────────────────────

async function init() {
  // Build meal review panel structure
  buildMealReviewPanel();

  // Load profile
  await loadProfileBadge();

  // Load lịch sử từ DB
  try {
    const { messages } = await api.chatbot.getHistory();
    if (messages.length > 0) {
      conversationHistory = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.message }],
      }));
      restoreUiFromHistory();
    } else {
      showWelcomeMessage();
    }
  } catch {
    showWelcomeMessage();
  }

  renderChips(hasProfile);
}

init();
