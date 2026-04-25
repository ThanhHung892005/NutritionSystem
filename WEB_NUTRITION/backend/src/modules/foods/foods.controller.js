const { validationResult } = require("express-validator");
const service = require("./foods.service");

async function searchFoods(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { search, disease, limit } = req.query;
    const results = await service.searchFoods({ search, disease, limit });
    res.json({ foods: results, count: results.length });
  } catch (err) {
    next(err);
  }
}

module.exports = { searchFoods };
