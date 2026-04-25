const express = require("express");
const { query } = require("express-validator");
const { requireAuth } = require("../../middleware/auth");
const controller = require("./foods.controller");

const router = express.Router();

router.use(requireAuth);

// GET /api/v1/foods?search=gà&disease=diabetes&limit=20
router.get(
  "/",
  [
    query("search").optional().trim().isLength({ max: 100 }),
    query("disease")
      .optional()
      .isIn(["diabetes", "hypertension", "gout", "kidney", "celiac"])
      .withMessage("Bệnh lý không hợp lệ"),
    query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
  ],
  controller.searchFoods,
);

module.exports = router;
