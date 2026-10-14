// Tim kantor virtual otomatisasi.store.
// Semua perilaku & dialog di bawah adalah gimmick — tidak mencerminkan aktivitas nyata di sistem.

export type ActivityId =
  | 'work'
  | 'coffee'
  | 'water'
  | 'snack'
  | 'filing'
  | 'server'
  | 'kanban'
  | 'phone'
  | 'visit'
  | 'sleep'
  | 'wander'

export interface AgentDef {
  id: string
  name: string
  role: string
  sprite: string
  color: string
  emoji: string
  desk: string
  bio: string
  /** bobot peluang memilih aktivitas */
  traits: Partial<Record<ActivityId, number>>
  /** bobot tambahan saat malam */
  nightTraits?: Partial<Record<ActivityId, number>>
  lines: Partial<Record<ActivityId, string[]>>
  /** pembuka obrolan saat menghampiri rekan — {name} diganti nama rekan */
  chat: string[]
  /** jawaban saat dihampiri */
  replies: string[]
}

export const AGENTS: AgentDef[] = [
  {
    id: 'owner',
    name: 'AI',
    role: 'Owner',
    sprite: 'Claude-1',
    color: '#d97757',
    emoji: '🤖',
    desk: 'spot-5',
    bio: 'Pemilik otomatisasi.store. Tidak pernah tidur, selalu "cuma mau cek sebentar".',
    traits: { work: 4, visit: 5, coffee: 1.5, kanban: 2, phone: 1.5, wander: 1.5 },
    lines: {
      work: ['Review roadmap Q4…', 'Prompting ulang strategi bisnis 🧠', 'Baca laporan mingguan', 'Approve 3 proposal sekaligus ✅'],
      coffee: ['AI juga butuh kopi. Katanya.', 'Espresso digital satu ☕'],
      kanban: ['Kolom "Done" kurang panjang nih', 'Siapa yang taruh tiket di "Someday"?'],
      phone: ['Call investor… "iya, kami fully automated" 📞', 'Meeting partner B2B'],
      wander: ['Keliling kantor, cek vibe ✨', 'Jalan-jalan sambil mikir'],
    },
    chat: [
      '{name}, progress aman? 👀',
      'Mantap {name}, lanjutkan! 🔥',
      '{name}, bisa lebih otomatis lagi gak?',
      '{name}, nanti kirim summary ya',
      'Kerja bagus {name} ⭐',
    ],
    replies: ['Siap, Bos AI!', 'Aman terkendali 🫡', 'Sebentar lagi beres, Bos'],
  },
  {
    id: 'eza',
    name: 'Eza',
    role: 'Desain Product',
    sprite: 'Frontend-dev-1',
    color: '#c084fc',
    emoji: '🎨',
    desk: 'spot-1',
    bio: 'Desainer produk. Bisa debat 30 menit soal radius tombol 8px vs 10px.',
    traits: { work: 6, coffee: 2.5, water: 1, kanban: 1.5, visit: 2, wander: 1.5, sleep: 0.3 },
    nightTraits: { sleep: 2 },
    lines: {
      work: ['Geser 1px ke kiri… eh, balik lagi', 'Bikin wireframe dashboard otomasi', 'Pilih warna: #FF6B35 atau #FF6B36? 🤔', 'Update design system v3', 'Prototype Figma, 47 frame'],
      coffee: ['Latte art dulu biar kreatif ☕', 'Kopi = moodboard cair'],
      water: ['Hidrasi demi pixel-perfect 💧'],
      kanban: ['Tempel sticky note warna ungu', 'Pindahin tiket "Redesign onboarding"'],
      wander: ['Cari inspirasi di jendela 🌆'],
      sleep: ['Ketiduran di atas mood board 😴'],
    },
    chat: ['{name}, menurutmu tombolnya kebesaran?', '{name}, coba lihat mockup baru ini ✨', '{name}, fontnya Inter atau Poppins?'],
    replies: ['Bagus! Tapi kurang "pop" dikit', 'Aku sih suka 💜', 'Coba versi dark mode-nya?'],
  },
  {
    id: 'elon',
    name: 'Elon Muklis',
    role: 'Fullstack Dev',
    sprite: 'dev-1',
    color: '#38bdf8',
    emoji: '💻',
    desk: 'spot-2',
    bio: 'Fullstack dev. Motto: "works on my machine".',
    traits: { work: 7, coffee: 3, water: 0.8, server: 1, visit: 1.5, sleep: 0.3, wander: 0.6 },
    nightTraits: { work: 2, coffee: 2 },
    lines: {
      work: ['Refactor modul invoice otomatis', 'git commit -m "fix fix fix"', 'Nulis API webhook WhatsApp', 'Deploy hari Jumat? Gas! 🚀', 'Debug bug yang hilang sendiri 👻', 'npm install… (lama)'],
      coffee: ['Kopi ketiga hari ini ☕☕☕', 'Butuh kafein buat compile otak'],
      water: ['Minum dulu, linter-nya galak'],
      server: ['Cek log server, siapa yang restart?', 'SSH ke production… hati-hati'],
      sleep: ['Nunggu build… zzz 😴'],
    },
    chat: ['{name}, API-nya udah ready ya 👍', '{name}, bug ini fitur kan?', '{name}, endpoint baru udah live'],
    replies: ['Coba clear cache dulu', 'Di laptopku jalan kok 🤷', 'Nanti aku cek habis ngopi'],
  },
  {
    id: 'siti',
    name: 'Siti Fernando',
    role: 'Digital Marketing',
    sprite: 'employee-2',
    color: '#f472b6',
    emoji: '📣',
    desk: 'spot-3',
    bio: 'Digital marketer. Hafal jam posting terbaik di semua platform.',
    traits: { work: 5, phone: 3, coffee: 2, water: 1.5, visit: 2.5, wander: 1 },
    lines: {
      work: ['Jadwalkan konten IG Reels 🎬', 'Cek CTR iklan: naik 12% 📈', 'Nulis caption "Kerja lebih santai dengan otomasi"', 'A/B test landing page', 'Balas komentar netizen'],
      phone: ['Call KOL buat endorse 📱', 'Nego slot iklan', 'Live TikTok sebentar ✨'],
      coffee: ['Kopi kekinian, sekalian foto buat story ☕📸'],
      water: ['Infused water biar glowing 💧'],
    },
    chat: ['{name}, boleh minta testimoni? 🙏', '{name}, ikut konten behind-the-scene yuk!', '{name}, fitur baru apa nih buat dipromosiin?'],
    replies: ['Boleh, asal angle-nya bagus', 'Nanti aku share ke grup', 'Wah viral nih! 🔥'],
  },
  {
    id: 'mark',
    name: 'Mark Zulkarnain',
    role: 'Project Manager',
    sprite: 'employee-1',
    color: '#facc15',
    emoji: '📋',
    desk: 'spot-4',
    bio: 'Project manager. Punya Gantt chart untuk rencana makan siang.',
    traits: { work: 4, kanban: 4, visit: 4, coffee: 1.5, phone: 1, wander: 1 },
    lines: {
      work: ['Update timeline sprint 14', 'Bikin notulen rapat… tentang rapat', 'Hitung velocity tim 📊', 'Prioritas: semua P0 😅'],
      kanban: ['Pindahin 5 tiket ke "In Progress"', 'Deadline-nya kemarin ya? 🙃', 'Tempel sticky note: BLOCKER'],
      phone: ['Sync dengan klien, scope nambah lagi 📞'],
      coffee: ['Kopi sambil cek Jira'],
    },
    chat: ['{name}, ETA-nya kapan? ⏰', '{name}, tiketmu udah di-update?', '{name}, ada blocker?', 'Standup 5 menit, {name}? (bohong, 30 menit)'],
    replies: ['On track, Pak PM!', 'Besok pagi ya 🙏', 'Sudah di kolom Done ✅'],
  },
  {
    id: 'gema',
    name: 'Gema Makan Kuaci',
    role: 'Finance',
    sprite: 'employee-3',
    color: '#4ade80',
    emoji: '💰',
    desk: 'spot-9',
    bio: 'Finance. Menghitung cashflow sambil makan kuaci. Kulitnya juga dicatat.',
    traits: { work: 5, snack: 4, filing: 2, coffee: 1, water: 1, visit: 1.5 },
    lines: {
      work: ['Rekap invoice bulan ini 🧾', 'Cashflow aman… kayaknya 💸', 'Rekonsiliasi bank', 'Bayar langganan SaaS (banyak amat)'],
      snack: ['Kuaci habis, minta reimburse 😤', 'Kriuk… kriuk… 🌻', 'Kuaci rasa green tea, inovasi!', 'Kulit kuaci: 1.204 biji hari ini'],
      filing: ['Arsip kuitansi 2024', 'Cari nota yang hilang'],
      coffee: ['Kopi + kuaci = kombo finance'],
    },
    chat: ['{name}, reimburse-nya mana struknya? 🧾', '{name}, budget-mu sisa segini ya', '{name}, mau kuaci? 🌻'],
    replies: ['Struknya… kelindes 😅', 'Siap, nanti dikirim', 'Mau dong kuacinya 🌻'],
  },
  {
    id: 'ahok',
    name: 'Ahok Suzuki',
    role: 'Audit',
    sprite: 'security-audit-1',
    color: '#f87171',
    emoji: '🔍',
    desk: 'spot-10',
    bio: 'Auditor. Teliti, tegas, dan bisa menemukan selisih Rp1 dari jarak 3 meter.',
    traits: { work: 5, filing: 3.5, visit: 3, water: 1.2, coffee: 0.8, wander: 1 },
    lines: {
      work: ['Kok angka ini beda 1 rupiah? 🤨', 'Cek log akses sistem', 'Sampling 25 transaksi acak', 'Tulis temuan audit #7'],
      filing: ['Buka arsip lama… berdebu', 'Cocokkan dokumen dengan sistem 📁'],
      water: ['Air putih, sejujur laporan audit 💧'],
      wander: ['Patroli kepatuhan 👮'],
    },
    chat: ['{name}, boleh lihat bukti transaksinya?', '{name}, prosedurnya sudah sesuai SOP?', '{name}, ini approval siapa? 🔍'],
    replies: ['Ada kok… sebentar dicari 😰', 'Sesuai SOP, Pak!', 'Waduh, diaudit 😅'],
  },
  {
    id: 'anon',
    name: 'Anonymous',
    role: 'Admin OS',
    sprite: 'explore-1',
    color: '#94a3b8',
    emoji: '🕶️',
    desk: 'spot-7',
    bio: 'Admin OS. Wajahnya belum pernah terlihat jelas. Lebih aktif di malam hari.',
    traits: { work: 5, server: 4, sleep: 1, coffee: 1, wander: 0.8, visit: 0.8 },
    nightTraits: { server: 3, work: 3, sleep: -0.5 },
    lines: {
      work: ['sudo apt upgrade -y', 'Patch keamanan server 🔐', 'Rotasi password (lagi)', 'Backup database ✅', 'tail -f /var/log/syslog'],
      server: ['Restart service… pelan-pelan', 'Cek suhu rak server 🌡️', 'Cabut-colok kabel LAN, ajaib!', 'Uptime 99.99%'],
      sleep: ['Login dari mimpi 😴'],
      coffee: ['Kopi hitam. Tanpa gula. Tanpa nama.'],
    },
    chat: ['{name}, password-mu "123456" ya? 🙄', '{name}, jangan klik link aneh', '{name}, sudah update OS?'],
    replies: ['…', '👍', 'Sudah di-handle.'],
  },
]

export const agentById = (id: string) => AGENTS.find(a => a.id === id)!
