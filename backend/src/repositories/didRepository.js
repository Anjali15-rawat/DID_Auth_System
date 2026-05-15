const pool = require('../db/pool');

async function insertDID(did, owner_address) {
  try {
    const sql = `
      INSERT INTO did_registry (did, owner_address)
      VALUES ($1, $2)
      ON CONFLICT (did) DO NOTHING RETURNING *`;
    const { rows } = await pool.query(sql, [did, owner_address]);
    return rows[0];
  } catch (e) {
    console.error("DB Insert Error (did_registry):", e);
    return null;
  }
}

module.exports = { insertDID };
