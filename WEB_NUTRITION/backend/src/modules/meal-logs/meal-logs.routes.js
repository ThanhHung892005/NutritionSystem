const express = require("express");
const { body, query } = require("express-validator");
const { requireAuth } = require("../../middleware/auth");
const controller = require("./meal-logs.controller");

const router = express.Router();

router.use(requireAuth);

// GET /api/v1/meal-logs?date=2026-04-24
router.get(
  "/",
  [query("date").optional().isISO8601().withMessage("Ngày không hợp lệ")],
  controller.getLogs,
);

// POST /api/v1/meal-logs
router.post(
  "/",
  [
    body("mealType")
      .isIn(["breakfast", "lunch", "dinner", "snack"])
      .withMessage("Bữa ăn không hợp lệ"),
    body("foodId").optional().isUUID().withMessage("food_id không hợp lệ"),
    body("foodName")
      .trim()
      .notEmpty()
      .isLength({ max: 255 })
      .withMessage("Tên thực phẩm không được để trống"),
    body("amountG")
      .isFloat({ min: 1, max: 5000 })
      .withMessage("Khối lượng không hợp lệ (1–5000g)"),
    body("calories").optional().isFloat({ min: 0 }),
    body("loggedAt").optional().isISO8601(),
    body("note").optional().trim().isLength({ max: 500 }),
  ],
  controller.addLog,
);

// DELETE /api/v1/meal-logs/:id
router.delete("/:id", controller.deleteLog);

module.exports = router;
