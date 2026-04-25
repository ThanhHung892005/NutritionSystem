const express = require("express");
const { body } = require("express-validator");
const controller = require("./auth.controller");

const router = express.Router();

// POST /api/v1/auth/register
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail().withMessage("Email không hợp lệ"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Mật khẩu tối thiểu 8 ký tự"),
    body("fullName").optional().trim().isLength({ max: 255 }),
  ],
  controller.register,
);

// POST /api/v1/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Email không hợp lệ"),
    body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
  ],
  controller.login,
);

module.exports = router;
