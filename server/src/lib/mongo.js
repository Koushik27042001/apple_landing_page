const mongoose = require("mongoose");

let connecting = null;
let mode = "none"; // "mongo" | "json"

async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.indexOf("mongodb") !== 0) {
    mode = "json";
    console.warn("[mongo] MONGODB_URI missing — using JSON file storage.");
    return false;
  }
  if (mongoose.connection.readyState === 1) {
    mode = "mongo";
    return true;
  }
  if (connecting) return connecting;

  connecting = mongoose
    .connect(uri, { serverSelectionTimeoutMS: 15000 })
    .then(function (conn) {
      mode = "mongo";
      console.log("[mongo] Connected to", conn.connection.name);
      return true;
    })
    .catch(function (err) {
      connecting = null;
      mode = "json";
      console.warn(
        "[mongo] Connection failed (" + err.message + ") — falling back to JSON file storage."
      );
      return false;
    });

  return connecting;
}

function isConnected() {
  return mode === "mongo" && mongoose.connection.readyState === 1;
}

function getDbMode() {
  return isConnected() ? "mongodb" : "json";
}

module.exports = { connectMongo, isConnected, getDbMode, mongoose };
