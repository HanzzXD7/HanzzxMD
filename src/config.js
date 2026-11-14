import "dotenv/config";

const ownerNumber = (process.env.OWNER_NUMBER || "").replace(/\D/g, "");
const enableWhatsApp = process.env.ENABLE_WHATSAPP === "true";

export const config = {
  port: Number(process.env.PORT || 3000),
  ownerNumber,
  dashboardUsername: process.env.DASHBOARD_USERNAME || "owner",
  dashboardPassword: process.env.DASHBOARD_PASSWORD || "",
  enableWhatsApp,
  authDir: process.env.AUTH_DIR || "./data/auth_info"
};

if (!config.dashboardPassword) {
  console.warn("[CONFIG] DASHBOARD_PASSWORD belum diatur. Dashboard akan menolak akses sampai password diisi.");
}

if (!config.enableWhatsApp) {
  console.log("[CONFIG] WhatsApp dinonaktifkan. Atur ENABLE_WHATSAPP=true hanya saat siap menghubungkan akun.");
}
