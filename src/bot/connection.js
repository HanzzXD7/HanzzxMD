import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";
import { config } from "../config.js";
import { handleMessage } from "./commands.js";

export const botStatus = {
  connected: false,
  connecting: false,
  phone: null,
  lastUpdate: null
};

let currentSocket;

export async function startWhatsApp() {
  if (botStatus.connecting || botStatus.connected) return;
  botStatus.connecting = true;

  try {
    const { state, saveCreds } = await useMultiFileAuthState(config.authDir);

    const sock = makeWASocket({
      auth: state,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      browser: ["HanzzxMD", "Chrome", "1.0.0"],
      markOnlineOnConnect: false,
      syncFullHistory: false
    });

    currentSocket = sock;
    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        console.log("\n[WHATSAPP] Scan QR ini dari WhatsApp > Perangkat tertaut. Jangan bagikan QR kepada siapa pun.\n");
        qrcode.generate(qr, { small: true });
      }

      if (connection === "connecting") {
        botStatus.connecting = true;
        botStatus.lastUpdate = new Date().toISOString();
      }

      if (connection === "open") {
        botStatus.connected = true;
        botStatus.connecting = false;
        botStatus.phone = sock.user?.id?.split(":")[0] || null;
        botStatus.lastUpdate = new Date().toISOString();
        console.log("[WHATSAPP] Terhubung.");
      }

      if (connection === "close") {
        botStatus.connected = false;
        botStatus.connecting = false;
        botStatus.phone = null;
        botStatus.lastUpdate = new Date().toISOString();

        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const loggedOut = statusCode === DisconnectReason.loggedOut;

        console.log("[WHATSAPP] Koneksi terputus.", loggedOut ? "Perlu tautkan ulang." : "Mencoba menyambung kembali...");

        if (!loggedOut && currentSocket === sock) {
          setTimeout(() => startWhatsApp().catch(console.error), 5000);
        }
      }
    });

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type !== "notify") return;
      for (const message of messages) {
        await handleMessage(sock, message);
      }
    });
  } catch (error) {
    botStatus.connecting = false;
    console.error("[WHATSAPP] Gagal memulai:", error);
    setTimeout(() => startWhatsApp().catch(console.error), 10000);
  }
}
