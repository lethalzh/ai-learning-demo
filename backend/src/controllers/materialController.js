const fallbackService = require("../services/fallbackService");
const { success, failure } = require("../utils/response");

function getFallback(req, res) {
  const { materialId, theme } = req.body || {};
  const material = fallbackService.resolve(materialId, theme);

  if (!material) {
    return res.status(404).json(
      failure(
        { code: "MATERIAL_NOT_FOUND", message: "未找到本地材料" },
        {}
      )
    );
  }

  res.json(
    success(fallbackService.toResult(material), { mode: "fallback", source: "local-cache" })
  );
}

function listSamples(req, res) {
  res.json(
    success(fallbackService.listSamples(), { mode: "online", source: "local-cache" })
  );
}

module.exports = { getFallback, listSamples };
