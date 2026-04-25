// Redirect nếu đã đăng nhập
if (getToken()) window.location.href = "dashboard.html";

const tabs = document.querySelectorAll(".auth-tab");
const forms = document.querySelectorAll(".auth-form");
const errorBox = document.getElementById("authError");
const errorMsg = document.getElementById("authErrorMsg");

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
    document
      .getElementById(`${tab.dataset.tab}Form`)
      .classList.add("is-active");
    hideError();
  });
});

function showError(msg) {
  errorMsg.textContent = msg;
  errorBox.hidden = false;
}

function hideError() {
  errorBox.hidden = true;
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.textContent = loading ? "Đang xử lý..." : btn.dataset.label;
}

// Save button labels
document.getElementById("loginBtn").dataset.label = "Đăng nhập";
document.getElementById("registerBtn").dataset.label = "Tạo tài khoản";

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();
  const btn = document.getElementById("loginBtn");
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  setLoading(btn, true);
  try {
    const { token, user } = await api.auth.login({ email, password });
    setSession(token, user);
    window.location.href = "dashboard.html";
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(btn, false);
  }
});

// Register
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();
    const btn = document.getElementById("registerBtn");
    const fullName = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;

    setLoading(btn, true);
    try {
      const { token, user } = await api.auth.register({
        fullName,
        email,
        password,
      });
      setSession(token, user);
      window.location.href = "profile.html";
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(btn, false);
    }
  });
