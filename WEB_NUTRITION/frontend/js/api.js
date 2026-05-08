const API_BASE = "http://localhost:3001/api/v1";

function getToken() {
  return localStorage.getItem("ns_token");
}

function setSession(token, user) {
  localStorage.setItem("ns_token", token);
  localStorage.setItem("ns_user", JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem("ns_token");
  localStorage.removeItem("ns_user");
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("ns_user"));
  } catch {
    return null;
  }
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = "auth.html";
  }
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = data.errors?.[0]?.msg || data.error || `Lỗi ${res.status}`;
    throw Object.assign(new Error(msg), { status: res.status, data });
  }
  return data;
}

const api = {
  auth: {
    register: (body) =>
      apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    login: (body) =>
      apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  },
  profile: {
    get: () => apiFetch("/health-profiles"),
    save: (body) =>
      apiFetch("/health-profiles", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    calculate: () => apiFetch("/health-profiles/calculate"),
  },
  foods: {
    search: (params = {}) => apiFetch(`/foods?${new URLSearchParams(params)}`),
  },
  weightLog: {
    list: (params = {}) =>
      apiFetch(`/weight-logs?${new URLSearchParams(params)}`),
    add: (body) =>
      apiFetch("/weight-logs", { method: "POST", body: JSON.stringify(body) }),
    delete: (id) => apiFetch(`/weight-logs/${id}`, { method: "DELETE" }),
  },
  mealLog: {
    list: (params = {}) =>
      apiFetch(`/meal-logs?${new URLSearchParams(params)}`),
    add: (body) =>
      apiFetch("/meal-logs", { method: "POST", body: JSON.stringify(body) }),
    delete: (id) => apiFetch(`/meal-logs/${id}`, { method: "DELETE" }),
  },
  mealPlan: {
    list: (params = {}) =>
      apiFetch(`/meal-plans?${new URLSearchParams(params)}`),
    generate: (body) =>
      apiFetch("/meal-plans/generate", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  reports: {
    weekly: (params = {}) =>
      apiFetch(`/reports/weekly?${new URLSearchParams(params)}`),
  },
  chatbot: {
    send: (body) =>
      apiFetch("/chatbot/message", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    getHistory: () => apiFetch("/chatbot/history"),
    clearHistory: () => apiFetch("/chatbot/history", { method: "DELETE" }),
  },
};

function initDashNav() {
  const hamburger = document.getElementById("dashHamburger");
  const drawer = document.getElementById("dashMobileDrawer");
  const mobileLogout = document.getElementById("mobileLogoutBtn");
  const mobileNameEl = document.getElementById("mobileNavUserName");

  if (!hamburger || !drawer) return;

  // Align drawer top to actual nav height
  const nav = document.querySelector(".dash-nav");
  if (nav) {
    drawer.style.top = nav.getBoundingClientRect().height + "px";
  }

  // Sync username
  const u = getUser();
  if (mobileNameEl && u) {
    mobileNameEl.textContent = u.full_name || u.username || "—";
  }

  // Auto-detect active link
  const currentPage =
    window.location.pathname.split("/").pop() || "dashboard.html";
  drawer.querySelectorAll(".dash-mobile-link").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("is-active");
    }
  });

  function closeDrawer() {
    drawer.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
  }

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.toggle("is-open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    drawer.setAttribute("aria-hidden", String(!isOpen));
  });

  drawer.querySelectorAll(".dash-mobile-link").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".dash-nav") &&
      !e.target.closest(".dash-mobile-drawer")
    ) {
      closeDrawer();
    }
  });

  if (mobileLogout) {
    mobileLogout.addEventListener("click", () => {
      clearSession();
      window.location.href = "auth.html";
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDashNav);
} else {
  initDashNav();
}
