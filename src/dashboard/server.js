import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "../config.js";
import { botStatus } from "../bot/connection.js";

const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(here, "../../public");
const startedAt = Date.now();

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

app.get("/health", (req, res) => res.json({ ok: true }));

function requireDashboardAuth(req, res, next) {
  if (!config.dashboardPassword) {
    return res.status(503).send("Atur DASHBOARD_PASSWORD di environment variables terlebih dahulu.");
  }

  const header = req.headers.authorization || "";
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) {
    res.setHeader("WWW-Authenticate", 'Basic realm="HanzzxMD Private Dashboard"');
    return res.status(401).send("Login dashboard diperlukan.");
  }

  let decoded = "";
  try {
    decoded = Buffer.from(encoded, "base64").toString("utf8");
  } catch {
    return res.status(401).send("Autentikasi tidak valid.");
  }

  const separator = decoded.indexOf(":");
  const username = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);

  if (separator < 0 || username !== config.dashboardUsername || password !== config.dashboardPassword) {
    res.setHeader("WWW-Authenticate", 'Basic realm="HanzzxMD Private Dashboard"');
    return res.status(401).send("Username atau password salah.");
  }

  next();
}

app.use("/", requireDashboardAuth);
app.get("/api/status", (req, res) => {
  res.json({
    ...botStatus,
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    service: "HanzzxMD"
  });
});
app.use(express.static(publicDir));

export function startDashboard() {
  return app.listen(config.port, "0.0.0.0", () => {
    console.log(`[DASHBOARD] Berjalan pada port ${config.port}`);
  });
}
