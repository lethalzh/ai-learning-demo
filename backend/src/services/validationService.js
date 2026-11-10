function normalizeText(text) {
  if (!text || typeof text !== "string") return "";
  return text.replace(/\r/g, "").trim();
}

function isLikelyInvalidText(text) {
  const normalized = normalizeText(text);
  if (!normalized) return true;
  if (normalized.length < 50) return true;
  const invalidCharRatio =
    (normalized.match(/[^\u4e00-\u9fa5a-zA-Z0-9\s.,!?，。！？；：""''\n\r]/g) || []).length /
    normalized.length;
  return invalidCharRatio > 0.2;
}

function isValidResultSchema(data) {
  if (!data || typeof data !== "object") return false;
  if (typeof data.summary !== "string") return false;
  if (!Array.isArray(data.keyPoints)) return false;
  if (!Array.isArray(data.taskList)) return false;
  if (!Array.isArray(data.reviewPlan)) return false;
  if (!Array.isArray(data.terms)) return false;
  if (!Array.isArray(data.warnings)) return false;
  return true;
}

module.exports = { normalizeText, isLikelyInvalidText, isValidResultSchema };
