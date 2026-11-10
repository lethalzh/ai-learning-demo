const analysisService = require("../services/analysisService");
const keywordExpansionService = require("../services/keywordExpansionService");
const { success, failure } = require("../utils/response");

async function analyze(req, res) {
  const payload = req.body || {};

  const outcome = await analysisService.analyze({
    theme: payload.theme || "AI基础入门",
    learningGoal: payload.learningGoal || "快速掌握关键内容",
    materialText: payload.materialText || "",
    mode: payload.mode || "study"
  });

  const body = outcome.ok
    ? success(outcome.data, { mode: outcome.mode, source: outcome.source })
    : failure(outcome.error, outcome.data, { mode: outcome.mode, source: outcome.source });

  res.json(body);
}

async function expandKeywords(req, res) {
  const payload = req.body || {};

  try {
    const data = await keywordExpansionService.expandKeywords({
      keywords: payload.keywords || "",
      theme: payload.theme || "AI基础入门"
    });

    res.json(success(data, { mode: "online", source: "deepseek" }));
  } catch (error) {
    const status = error.code === "INVALID_KEYWORDS" ? 400 : 502;

    res
      .status(status)
      .json(
        failure(
          { code: error.code || "EXPANSION_FAILED", message: error.message || "关键词扩写失败" },
          null,
          { mode: "online", source: "deepseek" }
        )
      );
  }
}

module.exports = { analyze, expandKeywords };
