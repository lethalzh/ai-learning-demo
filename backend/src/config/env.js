const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });
dotenv.config({ path: path.join(__dirname, "../../.env.local"), override: true });

const corsOrigins = [
  process.env.FRONTEND_ORIGIN,
  ...(process.env.CORS_ORIGINS || "").split(",")
]
  .map((item) => (item || "").trim())
  .filter(Boolean);

module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  // 生产环境可配置的跨域白名单（不含通配），开发环境见 config/cors.js
  corsOrigins: [...new Set(corsOrigins)],
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
    timeout: 15000
  }
};
