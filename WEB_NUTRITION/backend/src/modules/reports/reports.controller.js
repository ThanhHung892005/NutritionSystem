const { validationResult } = require("express-validator");
const service = require("./reports.service");

async function getWeeklyReport(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const result = await service.getWeeklyReport(
      req.userId,
      req.query.weekStart,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getWeeklyReport };
