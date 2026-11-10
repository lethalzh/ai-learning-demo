const axios = require("axios");
const { deepseek } = require("../config/env");

function buildPrompt({ theme, learningGoal, materialText, mode }) {
  return {
    model: deepseek.model,
    messages: [
      {
        role: "system",
        content: `你是一个严谨的学习助手。请基于用户提供的材料输出结构化 JSON。
只返回 valid JSON，不要解释，不要 markdown 代码块，不要额外文本。
返回字段必须严格满足以下结构：
{
  "summary": "string",
  "keyPoints": ["string"],
  "keyPointDetails": [
    { "explanation": "string", "example": "string", "notes": ["string"] }
  ],
  "taskList": [
    { "id": "task_1", "title": "string", "status": "pending", "priority": "high|medium|low", "category": "study|review|task" }
  ],
  "reviewPlan": [
    { "day": 1, "focus": "string", "actions": ["string"] }
  ],
  "terms": [
    { "word": "string", "meaning": "string", "example": "string", "difficulty": "easy|medium|hard", "detail": "string" }
  ],
  "warnings": ["string"]
}
注意：
1. taskList 至少 2 项。
2. reviewPlan 至少 2 项。
3. terms 至少 2 项。
4. keyPointDetails 必须与 keyPoints 一一对应，数量完全一致，按顺序排列。
5. 每个 terms 项的 detail 必须结合当前主题语境解释该术语的实际含义与作用，不要复述 meaning，长度 40-80 字。`
      },
      {
        role: "user",
        content: `主题：${theme || "通用学习"}
学习目标：${learningGoal || "理解并复习核心内容"}
分析模式：${mode || "study"}
学习材料：
${materialText}`
      }
    ],
    temperature: 0.7
  };
}

async function chatCompletionRaw(payload) {
  const { apiKey, baseUrl, timeout } = deepseek;

  if (!apiKey || apiKey === "your_deepseek_key_here") {
    throw { code: "MISSING_API_KEY", message: "未配置 DeepSeek API Key" };
  }

  const response = await axios.post(`${baseUrl}/v1/chat/completions`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    timeout
  });

  const content = response?.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw { code: "INVALID_RESPONSE", message: "DeepSeek 返回内容为空" };
  }

  let text = content.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```json\s*/, "").replace(/```$/, "").trim();
  }

  return text;
}

async function chatCompletion(payload) {
  const text = await chatCompletionRaw(payload);

  try {
    return JSON.parse(text);
  } catch (err) {
    throw { code: "INVALID_RESPONSE_SCHEMA", message: "DeepSeek 返回格式不合法" };
  }
}

module.exports = { buildPrompt, chatCompletion, chatCompletionRaw };
