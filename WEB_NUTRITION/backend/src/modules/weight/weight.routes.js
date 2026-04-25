const express = require("express");
const { body, query } = require("express-validator");
const { requireAuth } = require("../../middleware/auth");
const controller = require("./weight.controller");

const router = express.Router();

router.use(requireAuth);

// GET /api/v1/weight-logs?limit=30
router.get(
  "/",
  [query("limit").optional().isInt({ min: 1, max: 90 }).toInt()],
  controller.getLogs,
);

// POST /api/v1/weight-logs
router.post(
  "/",
  [
    body("weightKg")
      .isFloat({ min: 20, max: 500 })
      .withMessage("Cân nặng không hợp lệ (20–500 kg)"),
    body("note").optional().trim().isLength({ max: 500 }),
    body("loggedAt").optional().isISO8601().withMessage("Ngày không hợp lệ"),
  ],
  controller.addLog,
);

// DELETE /api/v1/weight-logs/:id
router.delete("/:id", controller.deleteLog);

module.exports = router;
