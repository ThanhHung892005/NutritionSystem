const { validationResult } = require("express-validator");
const service = require("./meal-logs.service");

async function getLogs(req, res, next) {
  try {
    const result = await service.getLogs(req.userId, req.query.date);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function addLog(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { mealType, foodId, foodName, amountG, calories, loggedAt, note } =
      req.body;
    const log = await service.addLog(req.userId, {
      mealType,
      foodId,
      foodName,
      amountG,
      calories,
      loggedAt,
      note,
    });
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
}

async function deleteLog(req, res, next) {
  try {
    await service.deleteLog(req.userId, req.params.id);
    res.json({ message: "Đã xóa" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getLogs, addLog, deleteLog };
