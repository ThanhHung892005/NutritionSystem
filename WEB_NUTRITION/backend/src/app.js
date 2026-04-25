require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./modules/auth/auth.routes");
const nutritionRoutes = require("./modules/nutrition/nutrition.routes");
const contactRoutes = require("./routes/contact");
const foodsRoutes = require("./modules/foods/foods.routes");
const weightRoutes = require("./modules/weight/weight.routes");
const mealLogsRoutes = require("./modules/meal-logs/meal-logs.routes");
const mealPlansRoutes = require("./modules/meal-plans/meal-plans.routes");
const chatbotRoutes = require("./modules/chatbot/chatbot.routes");
const reportsRoutes = require("./modules/reports/reports.routes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:8099" }));
app.use(express.json());

// Health check
app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/health-profiles", nutritionRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/foods", foodsRoutes);
app.use("/api/v1/weight-logs", weightRoutes);
app.use("/api/v1/meal-logs", mealLogsRoutes);
app.use("/api/v1/meal-plans", mealPlansRoutes);
app.use("/api/v1/chatbot", chatbotRoutes);
app.use("/api/v1/reports", reportsRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint không tồn tại" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Lỗi server nội bộ" });
});

app.listen(PORT, () => {
  console.log(`NutritionSystem API running on http://localhost:${PORT}/api/v1`);
});

module.exports = app;
