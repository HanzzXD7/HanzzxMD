import { config } from "./config.js";
import { startDashboard } from "./dashboard/server.js";

startDashboard();

if (config.enableWhatsApp) {
  const { startWhatsApp } = await import("./bot/connection.js");
  startWhatsApp().catch((error) => {
    console.error("[STARTUP] Bot gagal dimulai:", error);
  });
} else {
  console.log("[STARTUP] Dashboard aktif; koneksi WhatsApp belum diaktifkan.");
}

process.on("unhandledRejection", (error) => {
  console.error("[UNHANDLED REJECTION]", error);
});
