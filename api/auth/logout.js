const { clearSession, enforceOrigin } = require("../_lib/auth");

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).end();

  if (!enforceOrigin(req, res)) return;

  clearSession(res);
  res.status(200).json({ ok: true });
};
