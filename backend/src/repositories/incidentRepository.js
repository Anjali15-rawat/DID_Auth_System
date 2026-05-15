const pool = require('../db/pool');

async function createIncident(title, severity) {
  try {
    const sql = `INSERT INTO incidents (title, severity, state) VALUES ($1, $2, 'open') RETURNING *`;
    const { rows } = await pool.query(sql, [title, severity]);
    return rows[0];
  } catch (e) {
    console.error("DB Error (createIncident):", e);
    return null;
  }
}

async function getIncidents() {
  try {
    const sql = `SELECT * FROM incidents ORDER BY created_at DESC LIMIT 100`;
    const { rows } = await pool.query(sql);
    return rows;
  } catch (e) {
    console.error("DB Error (getIncidents):", e);
    return [];
  }
}

async function updateIncidentState(id, state) {
  try {
    const sql = `UPDATE incidents SET state = $1, updated_at = now() WHERE id = $2 RETURNING *`;
    const { rows } = await pool.query(sql, [state, id]);
    return rows[0];
  } catch (e) {
    console.error("DB Error (updateIncidentState):", e);
    return null;
  }
}

async function addInvestigationNote(incident_id, analyst_id, notes) {
  try {
    const sql = `INSERT INTO investigations (incident_id, analyst_id, notes) VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await pool.query(sql, [incident_id, analyst_id, notes]);
    return rows[0];
  } catch (e) {
    console.error("DB Error (addInvestigationNote):", e);
    return null;
  }
}

async function getNotes(incident_id) {
  try {
    const sql = `SELECT * FROM investigations WHERE incident_id = $1 ORDER BY created_at ASC`;
    const { rows } = await pool.query(sql, [incident_id]);
    return rows;
  } catch (e) {
    console.error("DB Error (getNotes):", e);
    return [];
  }
}

module.exports = { createIncident, getIncidents, updateIncidentState, addInvestigationNote, getNotes };
