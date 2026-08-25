const crypto = require("crypto");
const { readJson, writeJson } = require("./jsonDb");

const FILE = "admin-sessions.json";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function loadSessions() {
  const data = readJson(FILE, { sessions: [] });
  const now = Date.now();
  const sessions = (data.sessions || []).filter(function (s) {
    return s.expiresAt && new Date(s.expiresAt).getTime() > now;
  });
  if (sessions.length !== (data.sessions || []).length) {
    writeJson(FILE, { sessions: sessions });
  }
  return sessions;
}

function saveSessions(sessions) {
  writeJson(FILE, { sessions: sessions });
}

function login(password) {
  if (String(password || "") !== getPassword()) {
    return { ok: false, error: "Invalid password." };
  }
  const token = crypto.randomBytes(24).toString("hex");
  const sessions = loadSessions();
  sessions.push({
    token: token,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS).toISOString()
  });
  saveSessions(sessions);
  return { ok: true, token: token, expiresAt: sessions[sessions.length - 1].expiresAt };
}

function logout(token) {
  const sessions = loadSessions().filter(function (s) { return s.token !== token; });
  saveSessions(sessions);
}

function isValidToken(token) {
  if (!token) return false;
  return loadSessions().some(function (s) { return s.token === token; });
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : (req.headers["x-admin-token"] || "");
  if (!isValidToken(token)) {
    return res.status(401).json({ error: "Unauthorized. Please log in to the control panel." });
  }
  req.adminToken = token;
  next();
}

module.exports = { login, logout, requireAdmin, getPassword, isValidToken };
