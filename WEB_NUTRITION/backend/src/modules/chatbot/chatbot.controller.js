const { validationResult } = require("express-validator");
const service = require("./chatbot.service");

async function sendMessage(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { message, history = [] } = req.body;
    const result = await service.sendMessage(req.userId, message, history);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    const messages = await service.getHistory(req.userId);
    res.json({ messages });
  } catch (err) {
    next(err);
  }
}

async function clearHistory(req, res, next) {
  try {
    await service.clearHistory(req.userId);
    res.json({ message: "Đã xóa lịch sử hội thoại" });
  } catch (err) {
    next(err);
  }
}

module.exports = { sendMessage, getHistory, clearHistory };
