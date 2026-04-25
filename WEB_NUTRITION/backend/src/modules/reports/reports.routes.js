const express = require("express");
const { query } = require("express-validator");
const { requireAuth } = require("../../middleware/auth");
const controller = require("./reports.controller");

const router = express.Router();
router.use(requireAuth);

// GET /api/v1/reports/weekly?weekStart=2026-04-20
router.get(
  "/weekly",
  [
    query("weekStart")
      .optional()
      .isISO8601()
      .withMessage("weekStart phải là ngày hợp lệ (YYYY-MM-DD)"),
  ],
  controller.getWeeklyReport,
);

module.exports = router;
