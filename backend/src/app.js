const express = require("express");
const cors = require("cors");
const { corsOptions } = require("./config/cors");
const { failure } = require("./utils/response");
const routes = require("./routes");

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb" }));

app.use("/api", routes);

// 跨域来源被拒绝时给出明确的 403，而不是落到 Express 默认的 500
app.use((err, req, res, next) => {
  if (err && err.status === 403) {
    return res
      .status(403)
      .json(failure({ code: err.code || "CORS_ORIGIN_DENIED", message: err.message }, {}));
  }
  return next(err);
});

module.exports = app;
