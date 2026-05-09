const express = require("express");
const { body } = require("express-validator");
const controller = require("./auth.controller");

const router = express.Router();

// POST /api/v1/auth/register
router.post(
  "/register",
  [
    body("username")
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("Tên đăng nhập 3–50 ký tự")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Tên đăng nhập chỉ gồm chữ, số và dấu _"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Mật khẩu tối thiểu 6 ký tự"),
    body("fullName").optional().trim().isLength({ max: 255 }),
  ],
  controller.register,
);

// POST /api/v1/auth/login
router.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("Tên đăng nhập không được để trống"),
    body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
  ],
  controller.login,
);

module.exports = router;
