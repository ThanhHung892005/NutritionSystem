requireAuth();

const user = getUser();

// Nav
document.getElementById("navUserName").textContent =
  user?.full_name || user?.email || "—";
document.getElementById("greetName").textContent =
  user?.full_name?.split(" ").pop() || "bạn";

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  clearSession();
  window.location.href = "auth.html";
});

// Goal label map
const GOAL_LABEL = {
  lose_weight: "Giảm cân",
  maintain: "Duy trì",
  gain_muscle: "Tăng cơ",
};

async function loadStats() {
  try {
    const data = await api.profile.calculate();
    document.getElementById("dashStats").hidden = false;
    document.getElementById("profileBanner").hidden = true;

    document.getElementById("statBMI").textContent = data.bmi;
    document.getElementById("statBMIClass").textContent =
      data.bmi_classification;
    document.getElementById("statBMR").textContent =
      data.bmr.toLocaleString("vi-VN");
    document.getElementById("statTDEE").textContent =
      data.tdee.toLocaleString("vi-VN");
    document.getElementById("statTarget").textContent =
      data.target_calories.toLocaleString("vi-VN");
  } catch (err) {
    if (err.status === 404) {
      document.getElementById("profileBanner").hidden = false;
    }
  }
}

loadStats();
