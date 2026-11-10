const analysisService = require("../services/analysisService");
const modelStatusService = require("../services/modelStatusService");
const { success } = require("../utils/response");

async function getCacheStatus(req, res) {
  const modelStatus = await modelStatusService.getModelStatus({
    force: req.query.refresh === "1"
  });

  const data = {
    ...analysisService.getCacheStatus(),
    online: modelStatus.online,
    offlineReason: modelStatus.reason,
    offlineDetail: modelStatus.detail,
    checkedAt: modelStatus.checkedAt,
    cached: modelStatus.cached,
    currentMode: modelStatus.online ? "online" : "fallback"
  };

  res.json(
    success(data, {
      mode: modelStatus.online ? "online" : "fallback",
      source: modelStatus.online ? "deepseek" : "local-cache"
    })
  );
}

module.exports = { getCacheStatus };
