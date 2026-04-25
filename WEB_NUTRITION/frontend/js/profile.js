requireAuth();

const user = getUser();
document.getElementById("navUserName").textContent =
  user?.full_name || user?.email || "—";

document.getElementById("logoutBtn").addEventListener("click", () => {
  clearSession();
  window.location.href = "auth.html";
});

// Pre-fill form nếu đã có hồ sơ
async function loadExistingProfile() {
  try {
    const profile = await api.profile.get();
    if (!profile) return;

    document.getElementById("age").value = profile.age || "";
    document.getElementById("gender").value = profile.gender || "";
    document.getElementById("weightKg").value = profile.weight_kg || "";
    document.getElementById("heightCm").value = profile.height_cm || "";
    document.getElementById("activityLevel").value =
      profile.activity_level || "";
    document.getElementById("goal").value = profile.goal || "maintain";

    (profile.diseases || []).forEach((d) => {
      const cb = document.querySelector(`input[value="${d}"]`);
      if (cb) cb.checked = true;
    });

    if (profile.bmi) showResult(profile);
  } catch {
    // Chưa có hồ sơ — bỏ qua
  }
}

// Hiển thị kết quả BMI/BMR/TDEE
function showResult(data) {
  document.getElementById("profileResult").hidden = false;
  document.getElementById("resBMI").textContent = data.bmi ?? data.bmi;
  document.getElementById("resBMIClass").textContent =
    data.bmi_classification || classifyBMI(data.bmi);
  document.getElementById("resBMR").textContent = (
    data.bmr || 0
  ).toLocaleString("vi-VN");
  document.getElementById("resTDEE").textContent = (
    data.tdee || 0
  ).toLocaleString("vi-VN");
  document.getElementById("resTarget").textContent = (
    data.target_calories ||
    data.tdee ||
    0
  ).toLocaleString("vi-VN");

  // BMI bar: 0%=10, 100%=40 (phạm vi thực tế)
  const pct = Math.min(100, Math.max(0, ((data.bmi - 10) / 30) * 100));
  document.getElementById("bmiBarFill").style.width = `${pct}%`;
}

function classifyBMI(bmi) {
  if (bmi < 18.5) return "Thiếu cân";
  if (bmi < 23) return "Bình thường";
  if (bmi < 27.5) return "Thừa cân";
  return "Béo phì";
}

// Submit form
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const errorBox = document.getElementById("profileError");
  const errorMsg = document.getElementById("profileErrorMsg");
  errorBox.hidden = true;

  const btn = document.getElementById("saveBtn");
  btn.disabled = true;
  btn.textContent = "Đang lưu...";

  const diseases = [
    ...document.querySelectorAll('input[name="diseases"]:checked'),
  ].map((cb) => cb.value);

  const body = {
    age: parseInt(document.getElementById("age").value),
    gender: document.getElementById("gender").value,
    weightKg: parseFloat(document.getElementById("weightKg").value),
    heightCm: parseFloat(document.getElementById("heightCm").value),
    activityLevel: document.getElementById("activityLevel").value,
    goal: document.getElementById("goal").value,
    diseases,
  };

  try {
    const result = await api.profile.save(body);
    showResult({
      ...result,
      target_calories: calcTarget(result.tdee, body.goal),
    });
    document
      .getElementById("profileResult")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    errorMsg.textContent = err.message;
    errorBox.hidden = false;
  } finally {
    btn.disabled = false;
    btn.textContent = "Lưu hồ sơ & tính chỉ số";
  }
});

function calcTarget(tdee, goal) {
  if (goal === "lose_weight") return tdee - 500;
  if (goal === "gain_muscle") return tdee + 300;
  return tdee;
}

loadExistingProfile();
