import { startDashboard } from "./dashboard/server.js";
import { startWhatsApp } from "./bot/connection.js";

startDashboard();
startWhatsApp().catch((error) => {
  console.error("[STARTUP] Bot gagal dimulai:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("[UNHANDLED REJECTION]", error);
});
