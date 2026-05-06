const axios = require("axios");

const BASE_URL =
  "http://20.207.122.201/evaluation-service";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkYXJzaGFuc3VyZXNoMTgwNEBnbWFpbC5jb20iLCJleHAiOjE3NzgwNjI0MDQsImlhdCI6MTc3ODA2MTUwNCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjFjNjNjNTk0LTEzODctNGU0MC04OTUzLTkxMDA4MmZkYzcwNCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImRhcnNoYW4gc3VyZXNoIiwic3ViIjoiMjhlNDFlM2QtYWU2MS00ZTA4LTk4NWEtMGFmNTNmNTc3MTkxIn0sImVtYWlsIjoiZGFyc2hhbnN1cmVzaDE4MDRAZ21haWwuY29tIiwibmFtZSI6ImRhcnNoYW4gc3VyZXNoIiwicm9sbE5vIjoibXkuYWMucDJtY2EuMjUxMDQiLCJhY2Nlc3NDb2RlIjoiUFRCTW1RIiwiY2xpZW50SUQiOiIyOGU0MWUzZC1hZTYxLTRlMDgtOTg1YS0wYWY1M2Y1NzcxOTEiLCJjbGllbnRTZWNyZXQiOiJtZWNiQ25OcE5xQ0NORlloIn0.jwlNk8obs4bG_PsJEru1J1BA9Wr26OpQC1xGzX9arfI";

const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

async function Log(stack, level, pkg, message) {
  try {
    const response = await axios.post(
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
    console.log(
      `[${new Date().toISOString()}] ` +
      `[${stack.toUpperCase()}] ` +
      `[${level.toUpperCase()}] ` +
      `[${pkg.toUpperCase()}] ` +
      `${message}`
    );
    return response.data;
  } catch (err) {

    console.error("\nLOGGING FAILURE");
    console.error(
      `[STATUS] ${err.response?.status || "NO_STATUS"}`
    );
    console.error(
      `[ERROR] ${
        err.response?.data?.message ||
        err.message
      }`
    );
    console.error("");
  }
}
module.exports = Log;