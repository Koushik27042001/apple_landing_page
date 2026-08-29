const crypto = require("crypto");
const { readJson, writeJson } = require("./jsonDb");
const { isConnected } = require("./mongo");
const { AdminSession } = require("../models");

const FILE = "admin-sessions.json";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function readSessions() {
  const data = readJson(FILE, { sessions: [] });
  return Array.isArray(data.sessions) ? data.sessions : [];
}

function writeSessions(sessions) {
  writeJson(FILE, { sessions: sessions, updatedAt: new Date().toISOString() });
}

function pruneSessions(sessions) {
  const now = Date.now();
  return sessions.filter(function (s) {
    return s.expiresAt && new Date(s.expiresAt).getTime() > now;
  });
}

async function login(password) {
  if (String(password || "") !== getPassword()) {
    return { ok: false, error: "Invalid password." };
  }
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  if (isConnected()) {
    await AdminSession.create({
      token: token,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt
    });
  } else {
    const sessions = pruneSessions(readSessions());
    sessions.push({
      token: token,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    });
    writeSessions(sessions);
  }

  return { ok: true, token: token, expiresAt: expiresAt.toISOString() };
}

async function logout(token) {
  if (!token) return;
  if (isConnected()) {
    await AdminSession.deleteOne({ token: token });
    return;
  }
  writeSessions(pruneSessions(readSessions()).filter(function (s) { return s.token !== token; }));
}

async function isValidToken(token) {
  if (!token) return false;
  if (isConnected()) {
    const session = await AdminSession.findOne({
      token: token,
      expiresAt: { $gt: new Date() }
    }).lean();
    return !!session;
  }
  const sessions = pruneSessions(readSessions());
  writeSessions(sessions);
  return sessions.some(function (s) { return s.token === token; });
}

async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ")
      ? header.slice(7).trim()
      : (req.headers["x-admin-token"] || "");
    if (!(await isValidToken(token))) {
      return res.status(401).json({ error: "Unauthorized. Please log in to the control panel." });
    }
    req.adminToken = token;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { login, logout, requireAdmin, getPassword, isValidToken };
