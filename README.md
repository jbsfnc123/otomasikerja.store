# otomatisasi.store — Kantor Virtual

Kantor virtual pixel-art isometrik untuk **otomatisasi.store**, terinspirasi dari
[W17ant/Claude-Office](https://github.com/W17ant/Claude-Office).

> ⚠️ **Gimmick.** Semua gerakan, dialog, dan event di kantor ini dibuat **acak di browser**.
> Tidak ada koneksi ke backend dan tidak mencerminkan aktivitas nyata di otomatisasi.store.

## Tim

| Karakter | Peran | Kebiasaan acak |
|---|---|---|
| 🤖 AI | Owner | Keliling & "inspeksi" meja tim, kasih 👍/⭐/🔥, telepon investor |
| 🎨 Eza | Desain Product | Geser pixel, ngopi, tempel sticky note, ketiduran saat malam |
| 💻 Elon Muklis | Fullstack Dev | Coding, kopi berkali-kali, deploy 🚀 / build gagal 🔥 |
| 📣 Siti Fernando | Digital Marketing | Telepon KOL di lorong, minta testimoni, konten viral |
| 📋 Mark Zulkarnain | Project Manager | Papan kanban, tanya ETA, memanggil standup dadakan |
| 💰 Gema Makan Kuaci | Finance | Ngemil kuaci 🌻, rekap invoice, bongkar arsip |
| 🔍 Ahok Suzuki | Audit | Cari selisih Rp1, audit dadakan, lemari arsip |
| 🕶️ Anonymous | Admin OS | Rak server, patch keamanan, lebih aktif malam hari |

## Cara kerja simulasi

- `src/agents.ts` — profil, bobot aktivitas (`traits`, `nightTraits`), dan pool dialog tiap agent.
- `src/sim/engine.ts` — state machine per agent: tiap aktivitas selesai, aktivitas berikutnya dipilih
  **weighted-random** (bobot × jitter acak, siang/malam berpengaruh), lalu agent berjalan via waypoint.
- `src/sim/events.ts` — event kantor tiap 30–75 detik (order baru, deploy, build gagal, pizza, audit,
  standup, alert server, ulang tahun, krisis kuaci, konten viral) yang membuat beberapa agent bereaksi.
- `src/sim/office-map.ts` — koordinat meja, spot aktivitas, dan graf waypoint.

Kontrol di header: jeda, kecepatan 1×/2×/4×, siang/malam (auto mengikuti jam lokal), dan picu event manual.
Klik karakter untuk melihat profil & status. Tambahkan `?seed=123` di URL agar urutan acak bisa diulang.

## Menjalankan

```bash
npm install
npm run dev      # development
npm run build    # hasil statis di dist/ — bisa di-upload ke hosting mana pun
```

## Kredit

Aset gambar (ruangan, sprite karakter, furnitur, efek) dan data koordinat ruangan berasal dari
[Claude-Office](https://github.com/W17ant/Claude-Office) © 2026 W17ANT, lisensi MIT —
lihat [LICENSE-THIRD-PARTY.md](LICENSE-THIRD-PARTY.md).

## Lokasi utama

Versi yang dirawat dan di-deploy sekarang ada di repo
[`jbsfnc123/otomatisasi.store`](https://github.com/jbsfnc123/otomatisasi.store) pada folder `office/`
(lengkap dengan konfigurasi Cloudflare & workflow deploy).
