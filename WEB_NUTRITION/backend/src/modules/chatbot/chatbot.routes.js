const express = require("express");
const { body } = require("express-validator");
const { requireAuth } = require("../../middleware/auth");
const controller = require("./chatbot.controller");

const router = express.Router();

router.use(requireAuth);

// GET /api/v1/chatbot/history
router.get("/history", controller.getHistory);

// DELETE /api/v1/chatbot/history
router.delete("/history", controller.clearHistory);

// POST /api/v1/chatbot/message
router.post(
  "/message",
  [
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Tin nhắn không được để trống")
      .isLength({ max: 2000 })
      .withMessage("Tin nhắn tối đa 2000 ký tự"),
    body("history")
      .optional()
      .isArray({ max: 40 })
      .withMessage("Lịch sử tối đa 40 tin nhắn"),
  ],
  controller.sendMessage,
);

module.exports = router;
