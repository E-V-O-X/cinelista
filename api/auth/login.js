const bcrypt = require("bcryptjs");
const db = require("../_lib/db");
const { setSession, enforceOrigin } = require("../_lib/auth");

function readJson(req) {
  try {
    if (typeof req.body === "string") return JSON.parse(req.body || "{}");
    if (typeof req.body === "object" && req.body !== null) return req.body;
  } catch {}
  return {};
}

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    const origin = req.headers.origin || "";
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
    }
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") return res.status(405).end();

  if (!enforceOrigin(req, res)) return;

  try {
    const body = readJson(req);
    const { username = "", password = "" } = body;
    const u = (username || "").trim().toLowerCase();

    const { rows } = await db.query(
      "select id, username, password_hash from users where username=$1",
      [u]
    );
    if (!rows.length) return res.status(401).json({ error: "credenciais inválidas" });

    const ok = await bcrypt.compare(password, rows[0].password_hash);
    if (!ok) return res.status(401).json({ error: "credenciais inválidas" });

    setSession(res, { id: rows[0].id, username: rows[0].username });
    res.status(200).json({ user: { id: rows[0].id, username: rows[0].username } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "erro ao logar" });
  }
};
