const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = 3000;

const BASE_URL = "http://20.207.122.201/evaluation-service";

// PUT NEW TOKEN HERE
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkYXJzaGFuc3VyZXNoMTgwNEBnbWFpbC5jb20iLCJleHAiOjE3NzgwNjI0MDQsImlhdCI6MTc3ODA2MTUwNCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjFjNjNjNTk0LTEzODctNGU0MC04OTUzLTkxMDA4MmZkYzcwNCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImRhcnNoYW4gc3VyZXNoIiwic3ViIjoiMjhlNDFlM2QtYWU2MS00ZTA4LTk4NWEtMGFmNTNmNTc3MTkxIn0sImVtYWlsIjoiZGFyc2hhbnN1cmVzaDE4MDRAZ21haWwuY29tIiwibmFtZSI6ImRhcnNoYW4gc3VyZXNoIiwicm9sbE5vIjoibXkuYWMucDJtY2EuMjUxMDQiLCJhY2Nlc3NDb2RlIjoiUFRCTW1RIiwiY2xpZW50SUQiOiIyOGU0MWUzZC1hZTYxLTRlMDgtOTg1YS0wYWY1M2Y1NzcxOTEiLCJjbGllbnRTZWNyZXQiOiJtZWNiQ25OcE5xQ0NORlloIn0.jwlNk8obs4bG_PsJEru1J1BA9Wr26OpQC1xGzX9arfI";

const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

// ─────────────────────────────────────────
// TOKEN CHECK
// ─────────────────────────────────────────
try {
  const payload = JSON.parse(
    Buffer.from(TOKEN.split(".")[1], "base64").toString()
  );

  const expiry = new Date(payload.exp * 1000);

  console.log("Token Loaded");
  console.log("Expires:", expiry.toISOString());
} catch (err) {
  console.log("Invalid Token");
}

// ─────────────────────────────────────────
// LOGGER
// ─────────────────────────────────────────
async function Log(stack, level, pkg, message) {
  try {
    await axios.post(
      `${BASE_URL}/logs`,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: HEADERS,
      }
    );

    console.log(`[${level.toUpperCase()}] ${message}`);
  } catch (err) {
    console.log("Log Error:", err.response?.data || err.message);
  }
}

// ─────────────────────────────────────────
// KNAPSACK
// ─────────────────────────────────────────
function knapsack(tasks, capacity) {
  const n = tasks.length;

  const dp = Array(capacity + 1).fill(0);

  for (let i = 0; i < n; i++) {
    const duration = tasks[i].Duration;
    const impact = tasks[i].Impact;

    for (let w = capacity; w >= duration; w--) {
      dp[w] = Math.max(
        dp[w],
        dp[w - duration] + impact
      );
    }
  }

  let w = capacity;

  const selectedTasks = [];

  for (let i = n - 1; i >= 0; i--) {
    const duration = tasks[i].Duration;
    const impact = tasks[i].Impact;

    if (
      w >= duration &&
      dp[w] === dp[w - duration] + impact
    ) {
      selectedTasks.push(tasks[i]);
      w -= duration;
    }
  }

  const totalDuration = selectedTasks.reduce(
    (sum, t) => sum + t.Duration,
    0
  );

  const totalImpact = selectedTasks.reduce(
    (sum, t) => sum + t.Impact,
    0
  );

  return {
    selectedTasks,
    totalDuration,
    totalImpact,
  };
}

// ─────────────────────────────────────────
// HEALTH
// ─────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server Running",
  });
});

// ─────────────────────────────────────────
// GET DEPOTS
// ─────────────────────────────────────────
app.get("/depots", async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/depots`,
      {
        headers: HEADERS,
      }
    );

    return res.json({
      success: true,
      depots: response.data.depots,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message:
        err.response?.data || err.message,
    });
  }
});

// ─────────────────────────────────────────
// GET VEHICLES
// ─────────────────────────────────────────
app.get("/vehicles", async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/vehicles`,
      {
        headers: HEADERS,
      }
    );

    return res.json({
      success: true,
      vehicles: response.data.vehicles,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message:
        err.response?.data || err.message,
    });
  }
});

// ─────────────────────────────────────────
// SCHEDULE
// ─────────────────────────────────────────
app.get("/schedule", async (req, res) => {
  try {
    await Log(
      "backend",
      "info",
      "route",
      "GET /schedule called"
    );

    // FETCH DEPOTS
    const depotRes = await axios.get(
      `${BASE_URL}/depots`,
      {
        headers: HEADERS,
      }
    );

    const depots = depotRes.data.depots;

    console.log("Depots:", depots.length);

    // FETCH VEHICLES
    const vehicleRes = await axios.get(
      `${BASE_URL}/vehicles`,
      {
        headers: HEADERS,
      }
    );

    const vehicles = vehicleRes.data.vehicles;

    console.log("Vehicles:", vehicles.length);

    // CREATE SCHEDULE
    const schedule = depots.map((depot) => {
      const result = knapsack(
        vehicles,
        depot.MechanicHours
      );

      return {
        depotID: depot.ID,
        mechanicHoursBudget: depot.MechanicHours,
        selectedTasks: result.selectedTasks,
        totalDuration: result.totalDuration,
        totalImpact: result.totalImpact,
      };
    });

    return res.json({
      success: true,
      schedule,
    });
  } catch (err) {
    console.log(
      "MAIN ERROR:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      success: false,
      message:
        err.response?.data || err.message,
    });
  }
});

// ─────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(
    `\nServer running at http://localhost:${PORT}`
  );

  console.log(
    `GET http://localhost:${PORT}/schedule`
  );

  console.log(
    `GET http://localhost:${PORT}/health\n`
  );
});

