const pool = require('../db/pool');

async function insertFraudEvent(event) {
  try {
    const { tx_id, model, fraud_score, reason = null, ts = new Date() } = event;
    const sql = `
      INSERT INTO fraud_events (tx_id, model, fraud_score, reason, ts)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [tx_id, model, fraud_score, reason, ts];
    const { rows } = await pool.query(sql, values);
    return rows[0];
  } catch (e) {
    console.error("DB Insert Error (fraud_events):", e);
    return null;
  }
}

async function queryFraudEvents({ limit = 50, offset = 0, startTs, endTs }) {
  try {
    const conditions = [];
    const values = [];
    let idx = 1;
    if (startTs) { conditions.push(`ts >= $${idx++}`); values.push(startTs); }
    if (endTs)   { conditions.push(`ts <= $${idx++}`); values.push(endTs); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `
      SELECT * FROM fraud_events ${where}
      ORDER BY ts DESC
      LIMIT $${idx++} OFFSET $${idx}
    `;
    values.push(limit, offset);
    const { rows } = await pool.query(sql, values);
    return rows;
  } catch (e) {
    console.error("DB Query Error (fraud_events):", e);
    return [];
  }
}

module.exports = { insertFraudEvent, queryFraudEvents };
