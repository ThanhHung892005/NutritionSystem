const db = require("../../db");

const DISEASE_COLUMN = {
  diabetes: "ok_diabetes",
  hypertension: "ok_hypertension",
  gout: "ok_gout",
  kidney: "ok_kidney",
  celiac: "ok_celiac",
};

async function searchFoods({ search, disease, limit = 20 }) {
  const params = [];
  const conditions = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(
      `(name ILIKE $${params.length} OR name_en ILIKE $${params.length})`,
    );
  }

  if (disease && DISEASE_COLUMN[disease]) {
    conditions.push(`${DISEASE_COLUMN[disease]} = TRUE`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  params.push(limit);

  const { rows } = await db.query(
    `SELECT id, name, name_en, calories, protein_g, carbs_g, fat_g, fiber_g,
            ok_diabetes, ok_hypertension, ok_gout, ok_kidney, ok_celiac
     FROM foods
     ${where}
     ORDER BY name ASC
     LIMIT $${params.length}`,
    params,
  );

  return rows;
}

module.exports = { searchFoods };
