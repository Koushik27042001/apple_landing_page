const cloudinary = require("cloudinary").v2;

function configureCloudinary() {
  const url = process.env.CLOUDINARY_URL;
  if (!url) return false;

  const match = String(url).match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (match) {
    cloudinary.config({
      api_key: match[1],
      api_secret: match[2],
      cloud_name: match[3],
      secure: true
    });
    return true;
  }
  return false;
}

function isCloudinaryConfigured() {
  configureCloudinary();
  const config = cloudinary.config();
  return Boolean(config && config.cloud_name && config.api_key);
}

// Initial configuration attempt
configureCloudinary();

/**
 * Upload base64 image data to Cloudinary
 * @param {string} base64Data Raw base64 string or data URL
 * @param {string} filename Preferred filename or slug
 * @param {string} contentType MIME type (e.g. image/png)
 * @returns {Promise<string|null>} Cloudinary secure_url or null on failure
 */
async function uploadToCloudinary(base64Data, filename, contentType) {
  if (!isCloudinaryConfigured()) {
    return null;
  }

  try {
    const mime = contentType || "image/png";
    const dataUrl = base64Data.startsWith("data:")
      ? base64Data
      : `data:${mime};base64,${base64Data}`;

    const cleanName = String(filename || "upload")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    const publicId = `${cleanName}_${Date.now()}`;

    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: "apple_store_uploads",
      public_id: publicId,
      resource_type: "auto"
    });

    return (result && result.secure_url) || null;
  } catch (err) {
    console.error("[Cloudinary Storage] Upload error:", err.message || err);
    return null;
  }
}

module.exports = {
  cloudinary,
  configureCloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary
};
