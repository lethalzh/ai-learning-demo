const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../data/fallback-materials.json");

let cache = null;

function load() {
  if (!cache) {
    cache = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  }
  return cache;
}

function findAll() {
  return load();
}

function findById(id) {
  return load().find((item) => item.id === id) || null;
}

function findByTheme(theme) {
  const normalized = (theme || "").toLowerCase();
  const list = load();
  return list.find((item) => item.theme.toLowerCase().includes(normalized)) || list[0] || null;
}

function count() {
  return load().length;
}

module.exports = { findAll, findById, findByTheme, count };
