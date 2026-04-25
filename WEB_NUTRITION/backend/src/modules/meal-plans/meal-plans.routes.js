const express = require("express");
const { body, query } = require("express-validator");
const { requireAuth } = require("../../middleware/auth");
const controller = require("./meal-plans.controller");

const router = express.Router();

router.use(requireAuth);

// GET /api/v1/meal-plans?limit=7
router.get(
  "/",
  [query("limit").optional().isInt({ min: 1, max: 30 }).toInt()],
  controller.listPlans,
);

// POST /api/v1/meal-plans/generate
router.post(
  "/generate",
  [
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Ngày bắt đầu không hợp lệ"),
  ],
  controller.generatePlan,
);

module.exports = router;
