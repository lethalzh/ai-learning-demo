const express = require("express");
const analysisController = require("../controllers/analysisController");
const materialController = require("../controllers/materialController");
const statusController = require("../controllers/statusController");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

router.post("/analyze", analysisController.analyze);
router.post("/expand-keywords", analysisController.expandKeywords);
router.post("/fallback", materialController.getFallback);
router.get("/sample-materials", materialController.listSamples);
router.get("/cache-status", statusController.getCacheStatus);

module.exports = router;
