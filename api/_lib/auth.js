const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const COOKIE_NAME = "cinelista_session";
const MAX_AGE_DAYS = 30;

function setSession(res, payload) {
  const token = jwt.sign(payload, process.env.AUTH_SECRET, { expiresIn: `${MAX_AGE_DAYS}d` });
  const serialized = cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * MAX_AGE_DAYS
  });
  res.setHeader("Set-Cookie", serialized);
}

function clearSession(res) {
  const serialized = cookie.serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  res.setHeader("Set-Cookie", serialized);
}

function getUserFromReq(req) {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies[COOKIE_NAME];
    if (!token) return null;
    return jwt.verify(token, process.env.AUTH_SECRET);
  } catch {
    return null;
  }
}

// bloqueio simples por origem para métodos de escrita
function enforceOrigin(req, res) {
  const allowed = (process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || "")
    .split(",").map(s => s.trim()).filter(Boolean);
  const method = req.method || "GET";
  const isWrite = ["POST","PUT","PATCH","DELETE"].includes(method);
  const origin = req.headers.origin || "";

  if (!isWrite) return true; // só impõe em escrita

  if (origin && allowed.length && !allowed.includes(origin)) {
    res.status(403).json({ error: "forbidden" });
    return false;
  }
  if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  return true;
}

module.exports = { setSession, clearSession, getUserFromReq, enforceOrigin };
