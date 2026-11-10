const { chatCompletionRaw } = require("./deepseekService");
const { deepseek } = require("../config/env");

const MIN_MATERIAL_LENGTH = 80;

function normalizeKeywords(keywords) {
  if (typeof keywords !== "string") return [];
  return keywords
    .split(/[,，、;；\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildExpansionPrompt({ tokens, theme }) {
  return {
    model: deepseek.model,
    messages: [
      {
        role: "system",
        content: `你是一个学习材料撰写助手。请把用户给出的关键词扩写成一段有上下文、可以直接用来学习的中文材料。
要求：
1. 主题固定为「${theme || "通用学习"}」，所有内容围绕该主题展开。
2. 长度 200-350 字，包含概念解释、概念之间的关系和一个具体例子。
3. 只输出连续的自然段，不要标题、列表、markdown 或任何解释性前言。
4. 必须覆盖用户给出的全部关键词，不得遗漏。`
      },
      {
        role: "user",
        content: `关键词：${tokens.join("、")}`
      }
    ],
    temperature: 0.6
  };
}

async function expandKeywords({ keywords, theme }) {
  const tokens = normalizeKeywords(keywords);

  if (tokens.length === 0) {
    throw { code: "INVALID_KEYWORDS", message: "请先输入关键词，多个关键词用逗号或空格分隔" };
  }

  if (tokens.join("").length < 2) {
    throw { code: "INVALID_KEYWORDS", message: "关键词太短，请至少输入 2 个字符" };
  }

  let materialText;
  try {
    materialText = await chatCompletionRaw(buildExpansionPrompt({ tokens, theme }));
  } catch (err) {
    throw {
      code: err.code || "EXPANSION_FAILED",
      message: "关键词扩写失败，请稍后重试，或切换到正文材料模式"
    };
  }

  materialText = materialText.replace(/\r\n/g, "\n").trim();

  if (materialText.length < MIN_MATERIAL_LENGTH) {
    throw {
      code: "EXPANSION_TOO_SHORT",
      message: "关键词扩写结果过短，建议补充更多关键词后重试"
    };
  }

  return { keywords: tokens, materialText };
}

module.exports = { expandKeywords, normalizeKeywords };
