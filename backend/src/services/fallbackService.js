const materialRepository = require("../repositories/materialRepository");

function toResult(material) {
  if (!material || !material.result) return null;
  return { ...material.result };
}

function getResultByTheme(theme) {
  return toResult(materialRepository.findByTheme(theme)) || {};
}

function resolve(materialId, theme) {
  if (materialId) {
    return materialRepository.findById(materialId);
  }
  return materialRepository.findByTheme(theme || "AI基础入门");
}

function listSamples() {
  return materialRepository.findAll().map((item) => ({
    id: item.id,
    title: item.title,
    theme: item.theme,
    description: `适用于 ${item.theme} 的学习示例`,
    previewText: item.content
  }));
}

function count() {
  return materialRepository.count();
}

module.exports = { toResult, getResultByTheme, resolve, listSamples, count };
