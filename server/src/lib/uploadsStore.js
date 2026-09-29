const fs = require("fs");
const path = require("path");
const { readJson, writeJson } = require("./jsonDb");
const { isConnected } = require("./mongo");
const { UploadedImage } = require("../models");
const { uploadToCloudinary, isCloudinaryConfigured } = require("./cloudinary");

const FILE = "uploads.json";
const clientDir = path.join(__dirname, "../../../client");
const uploadsDir = process.env.UPLOAD_DIR || path.join(clientDir, "images/uploads");

function ensureUploadsDir() {
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (err) {
    // ignore read-only disk error
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
  // 1. Upload to Cloudinary when configured
  let cloudinaryUrl = null;
  if (isCloudinaryConfigured()) {
    cloudinaryUrl = await uploadToCloudinary(base64Data, filename, contentType);
  }

  // 2. Local disk fallback
  try {
    ensureUploadsDir();
    const filePath = path.join(uploadsDir, filename);
    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(filePath, buffer);
  } catch (err) {
    // ignore read-only disk error
  }

  // 3. Database / JSON fallback storage
  if (isConnected()) {
    await UploadedImage.updateOne(
      { filename: filename },
      { filename: filename, contentType: contentType, data: base64Data, cloudinaryUrl: cloudinaryUrl },
      { upsert: true }
    );
  } else {
    const map = readJsonUploads();
    map[filename] = {
      contentType: contentType,
      data: base64Data,
      cloudinaryUrl: cloudinaryUrl,
      updatedAt: new Date().toISOString()
    };
    writeJsonUploads(map);
  }

  return cloudinaryUrl || ("images/uploads/" + filename);
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
      return { contentType: doc.contentType || "image/png", buffer: buffer, cloudinaryUrl: doc.cloudinaryUrl || null };
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
    return { contentType: item.contentType || "image/png", buffer: buffer, cloudinaryUrl: item.cloudinaryUrl || null };
  }

  return null;
}

module.exports = {
  saveUpload,
  getUpload,
  ensureUploadsDir
};
