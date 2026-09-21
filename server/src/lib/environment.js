const path = require('path');

function validateEnvironment(env = process.env) {
  if (env.NODE_ENV !== 'production') return;
  if (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 20 || /admin123|change.me|your.password/i.test(env.ADMIN_PASSWORD)) {
    throw new Error('Production requires a unique ADMIN_PASSWORD of at least 20 characters.');
  }
  if (!env.DATA_DIR || !path.isAbsolute(env.DATA_DIR) || !env.UPLOAD_DIR || !path.isAbsolute(env.UPLOAD_DIR)) {
    throw new Error('Production requires absolute DATA_DIR and UPLOAD_DIR paths on persistent storage.');
  }
  if ((env.CORS_ORIGIN || '').split(',').some(origin => origin.trim() === '*')) {
    throw new Error('Use explicit CORS_ORIGIN values in production, or leave empty for same-origin hosting.');
  }
  if (!!env.RAZORPAY_KEY_ID !== !!env.RAZORPAY_KEY_SECRET) {
    throw new Error('Set both Razorpay API keys, or leave both empty for payment-link checkout.');
  }
}

module.exports = { validateEnvironment };
