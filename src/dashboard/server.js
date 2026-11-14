import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import { config } from "../config.js";
import { botStatus, startWhatsApp, createPairingCode } from "../bot/connection.js";

const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(here, "../../public");
const startedAt = Date.now();

app.disable("x-powered-by");
app.use(express.json({ limit: "2kb" }));
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

app.get("/api/status", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  let qrDataUrl = null;
  if (botStatus.qr) {
    try {
      qrDataUrl = await QRCode.toDataURL(botStatus.qr, { width: 240, margin: 2 });
    } catch {
      qrDataUrl = null;
    }
  }

  res.json({
    connected: botStatus.connected,
    connecting: botStatus.connecting,
    phone: botStatus.phone,
    qrDataUrl,
    pairingCode: botStatus.pairingCode,
    lastUpdate: botStatus.lastUpdate,
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    service: "HanzzxMD"
  });
});

app.post("/api/whatsapp/start", async (req, res) => {
  try {
    await startWhatsApp();
    res.json({ ok: true, message: "Koneksi WhatsApp dimulai. Tunggu QR muncul." });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message || "Gagal memulai koneksi." });
  }
});

app.post("/api/whatsapp/pairing-code", async (req, res) => {
  const phone = String(req.body?.phone || "").replace(/\D/g, "");
  if (!/^\d{8,15}$/.test(phone)) {
    return res.status(400).json({ ok: false, message: "Masukkan nomor internasional 8–15 digit tanpa tanda +." });
  }

  try {
    const code = await createPairingCode(phone);
    res.setHeader("Cache-Control", "no-store");
    res.json({ ok: true, code });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message || "Kode pairing belum bisa dibuat." });
  }
});

app.use(express.static(publicDir));

export function startDashboard() {
  return app.listen(config.port, "0.0.0.0", () => {
    console.log(`[DASHBOARD] Berjalan pada port ${config.port}`);
  });
}
