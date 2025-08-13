const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.POSTGRES_URL, ssl: { rejectUnauthorized: false } });

module.exports = async (_req, res) => {
  try {
    const r = await pool.query("select now()");
    res.status(200).json({ ok: true, now: r.rows[0].now });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: String(e) });
  }
};
