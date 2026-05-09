// Redirect nếu đã đăng nhập
if (typeof getToken === "function" && getToken()) {
  window.location.href = "dashboard.html";
}

const tabs = document.querySelectorAll(".auth-tab");
const forms = document.querySelectorAll(".auth-form");

// Tab switching
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    forms.forEach((f) => f.classList.remove("is-active"));
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");
    document.getElementById(`${tab.dataset.tab}Form`).classList.add("is-active");
    hideAllErrors();
  });
});

function hideAllErrors() {
  ["loginError", "registerError"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  });
}

// Hiển thị lỗi trong form hoặc toast nếu element không tìm thấy
function showError(formPrefix, msg) {
  const box = document.getElementById(formPrefix + "Error");
  const msgEl = document.getElementById(formPrefix + "ErrorMsg");
  if (box && msgEl) {
    msgEl.textContent = msg;
    box.hidden = false;
    return;
  }
  // Fallback: toast cố định ở cuối màn hình
  const old = document.getElementById("authToast");
  if (old) old.remove();
  const toast = document.createElement("div");
  toast.id = "authToast";
  toast.setAttribute("role", "alert");
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "1.5rem",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: "8px",
    padding: "12px 24px",
    color: "#dc2626",
    zIndex: "9999",
    font: "400 14px/1.4 sans-serif",
    minWidth: "220px",
    maxWidth: "90vw",
    textAlign: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,.12)",
  });
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.textContent = loading ? "Đang xử lý..." : btn.dataset.label;
}

// Ghi nhớ label ban đầu của nút
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
if (loginBtn) loginBtn.dataset.label = "Đăng nhập";
if (registerBtn) registerBtn.dataset.label = "Tạo tài khoản";

// ── LOGIN ──────────────────────────────────────────────
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const box = document.getElementById("loginError");
  if (box) box.hidden = true;

  const btn = document.getElementById("loginBtn");
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!username) { showError("login", "Vui lòng nhập tên đăng nhập"); return; }
  if (!password) { showError("login", "Vui lòng nhập mật khẩu"); return; }

  setLoading(btn, true);
  try {
    const { token, user } = await api.auth.login({ username, password });
    setSession(token, user);
    window.location.href = "dashboard.html";
  } catch (err) {
    showError("login", err.message || "Đăng nhập thất bại");
  } finally {
    setLoading(btn, false);
  }
});

// ── REGISTER ───────────────────────────────────────────
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const box = document.getElementById("registerError");
  if (box) box.hidden = true;

  const btn = document.getElementById("registerBtn");
  const fullName = document.getElementById("regName").value.trim();
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;

  if (!username) {
    showError("register", "Vui lòng nhập tên đăng nhập");
    return;
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    showError("register", "Tên đăng nhập chỉ gồm chữ, số và dấu _");
    return;
  }
  if (username.length < 3) {
    showError("register", "Tên đăng nhập tối thiểu 3 ký tự");
    return;
  }
  if (password.length < 6) {
    showError("register", "Mật khẩu tối thiểu 6 ký tự");
    return;
  }
  if (password !== confirmPassword) {
    showError("register", "Mật khẩu xác nhận không khớp");
    return;
  }

  setLoading(btn, true);
  try {
    const { token, user } = await api.auth.register({ fullName, username, password });
    setSession(token, user);
    window.location.href = "profile.html";
  } catch (err) {
    showError("register", err.message || "Đăng ký thất bại");
  } finally {
    setLoading(btn, false);
  }
});
