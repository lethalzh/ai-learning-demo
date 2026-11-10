const axios = require("axios");
const { deepseek } = require("../config/env");

const CACHE_TTL = 30 * 1000;
const PROBE_TIMEOUT = 4000;

let cache = { at: 0, result: null };

function isConfigured() {
  const { apiKey } = deepseek;
  return Boolean(apiKey) && apiKey !== "your_deepseek_key_here";
}

async function probe() {
  if (!isConfigured()) {
    return { online: false, reason: "MISSING_API_KEY", detail: "未配置 DeepSeek API Key" };
  }

  try {
    const response = await axios.get(`${deepseek.baseUrl}/v1/models`, {
      headers: { Authorization: `Bearer ${deepseek.apiKey}` },
      timeout: PROBE_TIMEOUT
    });

    if (response.status === 200) {
      return { online: true, reason: null, detail: "" };
    }

    return {
      online: false,
      reason: "MODEL_UNREACHABLE",
      detail: `模型服务返回异常状态 ${response.status}`
    };
  } catch (error) {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      return { online: false, reason: "INVALID_API_KEY", detail: "API Key 无效或已过期" };
    }

    return { online: false, reason: "MODEL_UNREACHABLE", detail: "无法连接模型服务" };
  }
}

async function getModelStatus({ force = false } = {}) {
  const now = Date.now();

  if (!force && cache.result && now - cache.at < CACHE_TTL) {
    return { ...cache.result, checkedAt: new Date(cache.at).toISOString(), cached: true };
  }

  const result = await probe();
  cache = { at: now, result };

  return { ...result, checkedAt: new Date(now).toISOString(), cached: false };
}

module.exports = { getModelStatus };
