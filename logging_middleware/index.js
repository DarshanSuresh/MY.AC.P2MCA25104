const express = require("express");
const Log = require("./logger");
const app = express();

app.use(express.json());

const PORT = 3000;

app.get("/", async (req, res) => {

  await Log(
    "backend",
    "info",
    "route",
    "Root route called"
  );

  res.json({
    success: true,
    message: "Logging Middleware Running",
  });

});

app.get("/log/info", async (req, res) => {

  await Log(
    "backend",
    "info",
    "controller",
    "Information log triggered"
  );

  res.json({
    success: true,
    type: "INFO",
    message: "Info log sent",
  });

});

app.get("/log/warn", async (req, res) => {

  await Log(
    "backend",
    "warn",
    "service",
    "Warning log triggered"
  );

  res.json({
    success: true,
    type: "WARN",
    message: "Warning log sent",
  });

});

app.get("/log/error", async (req, res) => {

  await Log(
    "backend",
    "error",
    "handler",
    "Error log triggered"
  );

  res.json({
    success: true,
    type: "ERROR",
    message: "Error log sent",
  });

});

app.get("/log/debug", async (req, res) => {

  await Log(
    "backend",
    "debug",
    "middleware",
    "Debug log triggered"
  );

  res.json({
    success: true,
    type: "DEBUG",
    message: "Debug log sent",
  });

});


app.listen(PORT, async () => {

  console.log(
    `\nLogging Middleware running on http://localhost:${PORT}`
  );

  console.log(
    `GET http://localhost:${PORT}/`
  );

  console.log(
    `GET http://localhost:${PORT}/log/info`
  );

  console.log(
    `GET http://localhost:${PORT}/log/warn`
  );

  console.log(
    `GET http://localhost:${PORT}/log/error`
  );

  console.log(
    `GET http://localhost:${PORT}/log/debug`
  );

  console.log(
    `GET http://localhost:${PORT}/test-error\n`
  );

  await Log(
    "backend",
    "info",
    "config",
    "Logging middleware server started"
  );

});