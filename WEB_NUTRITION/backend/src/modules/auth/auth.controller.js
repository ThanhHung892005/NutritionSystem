const { validationResult } = require("express-validator");
const authService = require("./auth.service");

async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { username, password, fullName } = req.body;
    const result = await authService.register({ username, password, fullName });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { username, password } = req.body;
    const result = await authService.login({ username, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
