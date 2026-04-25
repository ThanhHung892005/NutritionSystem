const express = require("express");
const { body } = require("express-validator");
const { requireAuth } = require("../../middleware/auth");
const controller = require("./nutrition.controller");

const router = express.Router();

const profileValidators = [
  body("age")
    .isInt({ min: 10, max: 120 })
    .withMessage("Tuổi không hợp lệ (10–120)"),
  body("gender")
    .isIn(["male", "female"])
    .withMessage("Giới tính phải là male hoặc female"),
  body("weightKg").isFloat({ min: 1 }).withMessage("Cân nặng không hợp lệ"),
  body("heightCm").isFloat({ min: 50 }).withMessage("Chiều cao không hợp lệ"),
  body("activityLevel")
    .isIn(["sedentary", "light", "moderate", "active", "very_active"])
    .withMessage("Mức độ vận động không hợp lệ"),
  body("goal")
    .optional()
    .isIn(["lose_weight", "maintain", "gain_muscle"])
    .withMessage("Mục tiêu không hợp lệ"),
  body("diseases").optional().isArray(),
];

// Tất cả routes yêu cầu đăng nhập
router.use(requireAuth);

// GET  /api/v1/health-profiles        — lấy hồ sơ của user hiện tại
router.get("/", controller.getProfile);

// POST /api/v1/health-profiles        — tạo hoặc cập nhật hồ sơ
router.post("/", profileValidators, controller.upsertProfile);

// GET  /api/v1/health-profiles/calculate — tính BMI/BMR/TDEE
router.get("/calculate", controller.calculate);

module.exports = router;
