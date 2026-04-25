const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Tên không được để trống"),
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("message")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Tin nhắn tối thiểu 10 ký tự"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // TODO Phase 2: gửi email hoặc lưu DB
    res.json({ message: "Cảm ơn! Chúng tôi sẽ liên hệ lại sớm." });
  },
);

module.exports = router;
