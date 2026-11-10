const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });
dotenv.config({ path: path.join(__dirname, "../../.env.local"), override: true });

module.exports = {
  port: process.env.PORT || 3001,
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
    timeout: 15000
  }
};
