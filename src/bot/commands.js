import { config } from "../config.js";

const menuText = `╭─「 HanzzxMD 」
│
├ .menu
├ .ping
├ .status
╰ .owner

Bot masih dalam tahap awal pengembangan.`;

export async function handleMessage(sock, message) {
  const jid = message.key.remoteJid;
  if (!jid || jid === "status@broadcast" || message.key.fromMe) return;
  if (jid.endsWith("@g.us")) return;

  const text = (
    message.message?.conversation ||
    message.message?.extendedTextMessage?.text ||
    message.message?.imageMessage?.caption ||
    message.message?.videoMessage?.caption ||
    ""
  ).trim();

  if (!text.startsWith(".")) return;

  const [command] = text.slice(1).toLowerCase().split(/\s+/);
  const sender = (message.key.participant || jid).split("@")[0].replace(/\D/g, "");
  const isOwner = Boolean(config.ownerNumber) && sender === config.ownerNumber;

  try {
    switch (command) {
      case "menu":
      case "help":
        await sock.sendMessage(jid, { text: menuText }, { quoted: message });
        break;
      case "ping":
        await sock.sendMessage(jid, { text: "Pong! HanzzxMD aktif." }, { quoted: message });
        break;
      case "status":
        await sock.sendMessage(jid, {
          text: `HanzzxMD aktif.\nMode: private chat\nOwner command: ${isOwner ? "aktif untuk akun ini" : "khusus owner"}`
        }, { quoted: message });
        break;
      case "owner":
        await sock.sendMessage(jid, {
          text: config.ownerNumber
            ? `Owner bot: wa.me/${config.ownerNumber}`
            : "Nomor owner belum diatur di environment variable."
        }, { quoted: message });
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("[COMMAND]", error);
  }
}
