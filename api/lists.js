const db = require("./_lib/db");
const { getUserFromReq, enforceOrigin } = require("./_lib/auth");

module.exports = async (req, res) => {
  const me = getUserFromReq(req);
  if (!me) return res.status(401).json({ error: "unauthorized" });

  if (req.method === "GET") {
    const { rows } = await db.query("select data from lists where user_id=$1", [me.id]);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ data: rows[0]?.data || null });
  }

  if (req.method === "PUT") {
    if (!enforceOrigin(req, res)) return;
    const { data } = JSON.parse(req.body || "{}");
    if (typeof data !== "object" || data === null) return res.status(400).json({ error: "invalid data" });

    await db.query(
      `insert into lists (user_id, data, updated_at)
       values ($1,$2, now())
       on conflict (user_id) do update set data=excluded.data, updated_at=now()`,
      [me.id, data]
    );
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
};
