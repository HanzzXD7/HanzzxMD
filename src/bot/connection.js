import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";
import pino from "pino";
import { config } from "../config.js";
import { handleMessage } from "./commands.js";

export const botStatus = {
  connected: false,
  connecting: false,
  phone: null,
  qr: null,
  pairingCode: null,
  lastUpdate: null
};

let currentSocket;
let startPromise;

export async function startWhatsApp() {
  if (botStatus.connected || currentSocket) return;
  if (startPromise) return startPromise;

  botStatus.connecting = true;
  startPromise = (async () => {
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
          botStatus.qr = qr;
          botStatus.pairingCode = null;
          botStatus.lastUpdate = new Date().toISOString();
        }

        if (connection === "connecting") {
          botStatus.connecting = true;
          botStatus.lastUpdate = new Date().toISOString();
        }

        if (connection === "open") {
          botStatus.connected = true;
          botStatus.connecting = false;
          botStatus.qr = null;
          botStatus.pairingCode = null;
          botStatus.phone = sock.user?.id?.split(":")[0] || null;
          botStatus.lastUpdate = new Date().toISOString();
          console.log("[WHATSAPP] Terhubung.");
        }

        if (connection === "close") {
          botStatus.connected = false;
          botStatus.connecting = false;
          botStatus.qr = null;
          botStatus.pairingCode = null;
          botStatus.phone = null;
          botStatus.lastUpdate = new Date().toISOString();
          if (currentSocket === sock) currentSocket = null;

          const statusCode = lastDisconnect?.error?.output?.statusCode;
          const loggedOut = statusCode === DisconnectReason.loggedOut;
          console.log("[WHATSAPP] Koneksi terputus.", loggedOut ? "Perlu tautkan ulang." : "Mencoba menyambung kembali...");

          if (!loggedOut) {
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
      currentSocket = null;
      botStatus.connecting = false;
      console.error("[WHATSAPP] Gagal memulai:", error);
      throw error;
    } finally {
      startPromise = null;
    }
  })();

  return startPromise;
}

export async function createPairingCode(phoneNumber) {
  if (botStatus.connected) throw new Error("WhatsApp sudah terhubung.");
  if (!currentSocket) throw new Error("Tekan Hubungkan WhatsApp terlebih dahulu, lalu tunggu sebentar.");
  if (currentSocket.authState?.creds?.registered) {
    throw new Error("Sesi WhatsApp sudah terdaftar. Putuskan sesi lama sebelum meminta kode baru.");
  }

  const code = await currentSocket.requestPairingCode(phoneNumber);
  botStatus.pairingCode = code;
  botStatus.qr = null;
  botStatus.lastUpdate = new Date().toISOString();
  return code;
}
