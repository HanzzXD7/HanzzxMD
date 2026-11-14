# HanzzxMD

WhatsApp bot starter dengan Node.js, Baileys, dan private dashboard.

## Fitur awal
- Pairing WhatsApp melalui QR.
- Perintah dasar: `.menu`, `.ping`, `.status`, `.owner`.
- Dashboard minimal dengan HTTP Basic Authentication.
- Endpoint pemeriksaan layanan: `/health`.

## Persiapan
- Node.js 20 atau lebih baru.
- Salin `.env.example` menjadi `.env`.
- Isi `OWNER_NUMBER` dengan nomor WhatsApp format internasional tanpa tanda plus.
- Ganti `DASHBOARD_PASSWORD` dengan password yang kuat dan unik.
- Jalankan `npm install`, lalu `npm start`.

## Keamanan
- Jangan commit file `.env`, folder `data/`, QR, atau data sesi.
- Jangan pernah mengirim QR atau file sesi kepada orang lain.
- Dashboard memakai Basic Auth; gunakan HTTPS saat di-host di internet.
- Baileys adalah integrasi tidak resmi melalui WhatsApp Web. Penggunaan dapat memiliki risiko pembatasan akun dan tidak dijamin oleh WhatsApp.

## Hosting
Render Free cocok untuk uji coba, bukan jaminan bot aktif 24/7. Penyimpanan filesystem pada layanan gratis dapat bersifat sementara; folder sesi `data/auth_info` bisa hilang saat instance diganti atau di-deploy ulang. Siapkan penyimpanan persisten yang sesuai sebelum penggunaan jangka panjang.

## Status
Starter project — fitur tambahan akan ditambahkan bertahap.
