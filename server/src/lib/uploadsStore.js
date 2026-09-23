const fs = require("fs");
const path = require("path");
const { readJson, writeJson } = require("./jsonDb");
const { isConnected } = require("./mongo");
const { UploadedImage } = require("../models");

const FILE = "uploads.json";
const clientDir = path.join(__dirname, "../../../client");
const uploadsDir = process.env.UPLOAD_DIR || path.join(clientDir, "images/uploads");

function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

function readJsonUploads() {
  const data = readJson(FILE, null);
  return data && typeof data === "object" ? data : {};
}

function writeJsonUploads(map) {
  writeJson(FILE, map || {});
}

async function saveUpload(filename, contentType, base64Data) {
  ensureUploadsDir();
  const filePath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync(filePath, buffer);

  if (isConnected()) {
    await UploadedImage.updateOne(
      { filename: filename },
      { filename: filename, contentType: contentType, data: base64Data },
      { upsert: true }
    );
    return;
  }

  const map = readJsonUploads();
  map[filename] = { contentType: contentType, data: base64Data, updatedAt: new Date().toISOString() };
  writeJsonUploads(map);
}

async function getUpload(filename) {
  ensureUploadsDir();
  const filePath = path.join(uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filename).toLowerCase();
    const typeMap = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" };
    return {
      contentType: typeMap[ext] || "application/octet-stream",
      buffer: fs.readFileSync(filePath)
    };
  }

  // Not on disk (e.g. ephemeral Render disk wiped), load from DB or JSON
  if (isConnected()) {
    const doc = await UploadedImage.findOne({ filename: filename }).lean();
    if (doc && doc.data) {
      const buffer = Buffer.from(doc.data, "base64");
      try {
        fs.writeFileSync(filePath, buffer);
      } catch (err) {
        // ignore disk write error on readonly environments
      }
      return { contentType: doc.contentType || "image/png", buffer: buffer };
    }
    return null;
  }

  const map = readJsonUploads();
  const item = map[filename];
  if (item && item.data) {
    const buffer = Buffer.from(item.data, "base64");
    try {
      fs.writeFileSync(filePath, buffer);
    } catch (err) {
      // ignore
    }
    return { contentType: item.contentType || "image/png", buffer: buffer };
  }

  return null;
}

module.exports = {
  saveUpload,
  getUpload,
  ensureUploadsDir
};
