const fs = require('fs');
const path = require('path');
const pool = require('../src/db/pool');

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('⏳ Running database migrations...');
    const sqlPath = path.join(__dirname, '../migrations/01_init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await client.query(sql);
    console.log('✅ Migrations applied successfully.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

runMigrations();
