const { normalizeText, isLikelyInvalidText, isValidResultSchema } = require("./validationService");
const { buildPrompt, chatCompletion } = require("./deepseekService");
const fallbackService = require("./fallbackService");

let lastSuccessAt = null;
let lastFailureReason = null;

async function analyze({ theme, learningGoal, materialText, mode }) {
  const text = normalizeText(materialText);

  if (!text || isLikelyInvalidText(text)) {
    lastFailureReason = "INVALID_INPUT";
    return {
      ok: false,
      mode: "fallback",
      source: "local-cache",
      error: {
        code: "INVALID_INPUT",
        message: "文本为空或过短，已切换到本地材料模式"
      },
      data: fallbackService.getResultByTheme(theme)
    };
  }

  try {
    const result = await chatCompletion(
      buildPrompt({
        theme,
        learningGoal,
        materialText: text,
        mode: mode || "study"
      })
    );

    if (!isValidResultSchema(result)) {
      throw { code: "INVALID_RESPONSE_SCHEMA", message: "返回结构不合法，已切换到本地材料模式" };
    }

    lastSuccessAt = new Date().toISOString();
    lastFailureReason = null;

    return {
      ok: true,
      mode: "online",
      source: "deepseek",
      error: null,
      data: result
    };
  } catch (error) {
    lastFailureReason = error.code || "MODEL_ERROR";
    return {
      ok: false,
      mode: "fallback",
      source: "local-cache",
      error: {
        code: error.code || "MODEL_ERROR",
        message: error.message || "模型处理失败，已切换到本地材料模式"
      },
      data: fallbackService.getResultByTheme(theme)
    };
  }
}

function getCacheStatus() {
  return {
    fallbackEnabled: true,
    localCacheCount: fallbackService.count(),
    lastSuccessAt: lastSuccessAt || new Date().toISOString(),
    currentMode: "online",
    lastFailureReason
  };
}

module.exports = { analyze, getCacheStatus };
