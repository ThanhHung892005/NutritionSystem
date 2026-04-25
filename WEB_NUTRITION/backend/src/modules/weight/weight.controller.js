const { validationResult } = require("express-validator");
const service = require("./weight.service");

async function getLogs(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const logs = await service.getLogs(req.userId, limit);
    res.json({ logs });
  } catch (err) {
    next(err);
  }
}

async function addLog(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { weightKg, loggedAt, note } = req.body;
    const log = await service.addLog(req.userId, { weightKg, loggedAt, note });
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
}

async function deleteLog(req, res, next) {
  try {
    await service.deleteLog(req.userId, req.params.id);
    res.json({ message: "Đã xóa log" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getLogs, addLog, deleteLog };
