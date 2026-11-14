# HanzzxMD

WhatsApp bot starter dengan Node.js, Baileys, dan private dashboard.

## Fitur awal
- Pairing WhatsApp melalui QR (opsional, dinonaktifkan secara default).
- Perintah dasar: `.menu`, `.ping`, `.status`, `.owner`.
- Dashboard minimal dengan HTTP Basic Authentication.
- Endpoint pemeriksaan layanan: `/health`.

## Persiapan
- Node.js 20 atau lebih baru.
- Salin `.env.example` menjadi `.env`.
- Atur `DASHBOARD_USERNAME` dan `DASHBOARD_PASSWORD` dengan kredensial unik.
- Atur `OWNER_NUMBER` dengan nomor WhatsApp format internasional tanpa tanda plus.
- Biarkan `ENABLE_WHATSAPP=false` sampai dashboard dan konfigurasi diperiksa.
- Jalankan `npm install`, lalu `npm start`.

## Mengaktifkan WhatsApp
Setelah siap menghubungkan akun, ubah `ENABLE_WHATSAPP=true` pada environment variables. QR akan muncul di terminal. Pindai hanya dari menu Perangkat tertaut di WhatsApp milik sendiri. Jangan bagikan QR, kredensial, atau folder sesi.

Baileys adalah integrasi tidak resmi melalui WhatsApp Web. Penggunaan dapat memiliki risiko pembatasan akun dan tidak dijamin oleh WhatsApp.

## Keamanan
- Jangan commit file `.env`, folder `data/`, QR, atau data sesi.
- Jangan pernah mengirim QR, password, token, atau file sesi kepada orang lain.
- Dashboard memakai HTTP Basic Authentication. Gunakan hanya melalui HTTPS saat di-host di internet.
- Gunakan password dashboard yang panjang dan unik.

## Hosting
Render Free cocok untuk uji coba, bukan jaminan bot aktif 24/7. Penyimpanan filesystem pada layanan gratis dapat bersifat sementara; folder sesi `data/auth_info` bisa hilang saat instance diganti atau di-deploy ulang. Siapkan penyimpanan persisten yang sesuai sebelum penggunaan jangka panjang.

## Status
Starter project — fitur tambahan akan ditambahkan bertahap.
