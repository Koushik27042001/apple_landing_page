/* Tiny JSON-file database helpers shared by all admin stores. */
const fs = require("fs");
const path = require("path");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "../../data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function filePath(name) {
  return path.join(DATA_DIR, name);
}

function readJson(name, fallback) {
  ensureDir();
  const fp = filePath(name);
  try {
    if (!fs.existsSync(fp)) {
      writeJson(name, fallback);
      return JSON.parse(JSON.stringify(fallback));
    }
    const raw = fs.readFileSync(fp, "utf8");
    return JSON.parse(raw || "null") ?? fallback;
  } catch (e) {
    throw new Error("Unable to read persistent store: " + name, { cause: e });
  }
}

function writeJson(name, data) {
  ensureDir();
  const target = filePath(name);
  const temporary = target + ".tmp";
  fs.writeFileSync(temporary, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(temporary, target);
}

module.exports = { DATA_DIR, readJson, writeJson, filePath };
