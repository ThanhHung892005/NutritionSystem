const { validationResult } = require("express-validator");
const service = require("./nutrition.service");

async function getProfile(req, res, next) {
  try {
    const profile = await service.getProfile(req.userId);
    if (!profile)
      return res.status(404).json({ error: "Chưa có hồ sơ sức khỏe" });
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

async function upsertProfile(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { age, gender, weightKg, heightCm, activityLevel, goal, diseases } =
      req.body;
    const result = await service.upsertProfile(req.userId, {
      age,
      gender,
      weightKg,
      heightCm,
      activityLevel,
      goal,
      diseases,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function calculate(req, res, next) {
  try {
    const result = await service.calculate(req.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, upsertProfile, calculate };
