# HanzzxMD

WhatsApp bot starter dengan Node.js, Baileys, dan private dashboard.

## Fitur awal
- Penautan WhatsApp melalui QR Code yang ditampilkan di dashboard.
- Penautan WhatsApp melalui pairing code dari nomor telepon.
- Perintah dasar: `.menu`, `.ping`, `.status`, `.owner`.
- Dashboard minimal dengan HTTP Basic Authentication.
- Endpoint pemeriksaan layanan: `/health`.

## Persiapan
- Node.js 20 atau lebih baru.
- Salin `.env.example` menjadi `.env`.
- Atur `DASHBOARD_USERNAME` dan `DASHBOARD_PASSWORD` dengan kredensial unik.
- Atur `OWNER_NUMBER` dengan nomor WhatsApp format internasional tanpa tanda plus.
- Biarkan `ENABLE_WHATSAPP=false` saat pertama kali memeriksa dashboard.
- Jalankan `npm install`, lalu `npm start`.

## Menghubungkan WhatsApp
1. Buka dashboard melalui alamat server dan login.
2. Tekan **Hubungkan WhatsApp**.
3. Pilih tab **QR Code** untuk memindai QR melalui menu Perangkat tertaut di WhatsApp, atau pilih **Nomor telepon** untuk meminta pairing code.
4. Masukkan pairing code pada menu Perangkat tertaut → Tautkan dengan nomor telepon di WhatsApp.

Gunakan hanya akun WhatsApp milik sendiri. Jangan membagikan QR, pairing code, kredensial, atau folder sesi. Kode penautan bersifat rahasia dan hanya ditampilkan pada dashboard yang dilindungi login.

Baileys adalah integrasi tidak resmi melalui WhatsApp Web. Penggunaan dapat memiliki risiko pembatasan akun dan tidak dijamin oleh WhatsApp.

## Keamanan
- Jangan commit file `.env`, folder `data/`, QR, atau data sesi.
- Jangan pernah mengirim QR, pairing code, password, token, atau file sesi kepada orang lain.
- Dashboard memakai HTTP Basic Authentication. Gunakan hanya melalui HTTPS saat di-host di internet.
- Gunakan password dashboard yang panjang dan unik.

## Hosting
Render Free cocok untuk uji coba, bukan jaminan bot aktif 24/7. Penyimpanan filesystem pada layanan gratis dapat bersifat sementara; folder sesi `data/auth_info` bisa hilang saat instance diganti atau di-deploy ulang. Siapkan penyimpanan persisten yang sesuai sebelum penggunaan jangka panjang.

## Status
Starter project — fitur tambahan akan ditambahkan bertahap.
