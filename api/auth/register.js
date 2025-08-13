const bcrypt = require("bcryptjs");
const db = require("../_lib/db");
const { setSession, enforceOrigin } = require("../_lib/auth");

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).end();

  if (!enforceOrigin(req, res)) return;

  try {
    const { username = "", password = "" } = JSON.parse(req.body || "{}");
    const u = (username || "").trim().toLowerCase();
    const p = (password || "").trim();

    if (!/^[a-z0-9_\.]{3,32}$/.test(u)) {
      return res.status(400).json({ error: "username inválido (3–32: a-z 0-9 . _)" });
    }
    if (p.length < 6 || p.length > 128) {
      return res.status(400).json({ error: "senha deve ter 6–128 caracteres" });
    }

    const exists = await db.query("select 1 from users where username=$1", [u]);
    if (exists.rowCount) return res.status(409).json({ error: "username já em uso" });

    const hash = await bcrypt.hash(p, 12);
    const { rows } = await db.query(
      "insert into users (username, password_hash) values ($1,$2) returning id, username",
      [u, hash]
    );

    setSession(res, { id: rows[0].id, username: rows[0].username });
    res.status(201).json({ user: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "erro ao registrar" });
  }
};
