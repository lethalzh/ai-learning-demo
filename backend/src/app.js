const express = require("express");
const cors = require("cors");
const { frontendOrigin } = require("./config/env");
const routes = require("./routes");

const app = express();

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));

app.use("/api", routes);

module.exports = app;
