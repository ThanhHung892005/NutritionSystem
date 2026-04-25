const { validationResult } = require("express-validator");
const service = require("./meal-plans.service");

async function generatePlan(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { startDate } = req.body;
    const result = await service.generatePlan(req.userId, startDate);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function listPlans(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 7;
    const plans = await service.listPlans(req.userId, limit);
    res.json({ plans });
  } catch (err) {
    next(err);
  }
}

module.exports = { generatePlan, listPlans };
