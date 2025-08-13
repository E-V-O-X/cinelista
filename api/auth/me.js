const { getUserFromReq } = require("../_lib/auth");
module.exports = async (req, res) => {
  const me = getUserFromReq(req);
  if (!me) return res.status(200).json({ user: null });
  res.status(200).json({ user: { id: me.id, username: me.username } });
};
