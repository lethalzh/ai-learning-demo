const { corsOrigins, nodeEnv } = require("./env");

// 开发环境：放行 localhost / 127.0.0.1 的任意端口（Vite 端口被占用会自动跳到 5174 等）
const DEV_ORIGIN_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const isProduction = nodeEnv === "production";
const allowedOrigins = new Set(corsOrigins);

function isDevOrigin(origin) {
  return DEV_ORIGIN_PATTERN.test(origin);
}

function isAllowedOrigin(origin) {
  // 无 Origin：同源请求、curl、服务端调用
  if (!origin) return true;
  if (!isProduction && isDevOrigin(origin)) return true;
  return allowedOrigins.has(origin);
}

// 通过回调返回 true 时，cors 会把请求方的 Origin 原样回显到 Access-Control-Allow-Origin，
// 因此开发环境下 5173、5174、任意本地端口都能各自拿到正确的响应头。
const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    const error = new Error(`来源 ${origin} 不在跨域白名单内`);
    error.status = 403;
    error.code = "CORS_ORIGIN_DENIED";
    return callback(error);
  }
};

module.exports = { corsOptions, isAllowedOrigin, isDevOrigin, isProduction };
