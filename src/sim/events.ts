// Event kantor acak yang memicu reaksi beberapa agent sekaligus (gimmick).
import type { OfficeSim } from './engine'
import { spotById } from './office-map'
import { between, pick, shuffle } from './rng'

export interface OfficeEvent {
  id: string
  title: string
  run: (sim: OfficeSim) => void
}

const PACKAGES = ['Paket Otomasi Invoice', 'Bot WhatsApp CS', 'Dashboard Laporan Harian', 'Integrasi Marketplace', 'Auto-Reminder Tagihan', 'Template Workflow HR']
const CLIENTS = ['Toko Berkah Jaya', 'CV Maju Mundur', 'Klinik Sehat Selalu', 'Warung Kopi Senja', 'PT Sinar Abadi', 'Bengkel Pak Kumis']

export const OFFICE_EVENTS: OfficeEvent[] = [
  {
    id: 'order',
    title: 'Order baru',
    run: sim => {
      sim.stats.orders++
      sim.log(null, `🛒 Order baru: ${pick(sim.rng, PACKAGES)} dari ${pick(sim.rng, CLIENTS)}`, 'event')
      sim.flash('siti', 'star')
      sim.say('siti', pick(sim.rng, ['Closing! 🎉', 'Iklan kemarin tembus 🔥', 'Funnel jalan mulus ✨']))
      sim.after(1800, () => {
        sim.flash('gema', '💸')
        sim.say('gema', 'Dana masuk, sudah dicatat ✍️')
      })
      sim.after(3500, () => sim.flash('owner', 'thumb-up'))
    },
  },
  {
    id: 'deploy',
    title: 'Deploy sukses',
    run: sim => {
      sim.stats.deploys++
      sim.log(null, `🚀 Deploy v2.${Math.floor(between(sim.rng, 10, 99))} ke production sukses`, 'event')
      sim.flash('elon', 'rocket', 6000)
      sim.say('elon', 'Deploy sukses, gak ada yang meledak 🚀')
      sim.after(2000, () => sim.say('anon', 'Server stabil. 👍'))
      sim.after(3000, () => sim.flash('eza', 'party'))
    },
  },
  {
    id: 'build-fail',
    title: 'Build gagal',
    run: sim => {
      sim.log(null, '🔥 Pipeline build gagal di branch main!', 'event')
      sim.flash('elon', 'build-failed', 7000)
      sim.say('elon', 'Siapa yang push ke main?! 😱')
      const rack = spotById('spot-printer')
      sim.interrupt('anon', { activity: 'server', label: 'Darurat: cek server', dest: rack, spot: rack, dur: 9000, effect: 'fire', line: 'Rollback dulu… 🛠️' })
      sim.after(2500, () => {
        sim.flash('mark', 'need-coffee')
        sim.say('mark', 'Ini masuk risk register sprint ya…')
      })
    },
  },
  {
    id: 'pizza',
    title: 'Traktiran pizza',
    run: sim => {
      sim.log(null, '🍕 Owner AI traktir pizza satu kantor!', 'event')
      sim.active().forEach((a, i) => sim.after(i * 300, () => sim.flash(a.def.id, 'pizza', 6000)))
      const lines = ['Yesss 🍕', 'Topping nanas? 😳', 'Diet mulai besok', 'Aku ambil dua ya', 'Gratis = enak']
      shuffle(sim.rng, sim.active()).slice(0, 3).forEach((a, i) => sim.after(1200 + i * 1500, () => sim.say(a.def.id, lines[i % lines.length])))
    },
  },
  {
    id: 'audit',
    title: 'Audit dadakan',
    run: sim => {
      const target = pick(sim.rng, sim.active().filter(a => a.def.id !== 'ahok'))
      const ahok = sim.get('ahok')
      if (!target || ahok.phase === 'hidden') return
      sim.log(null, `📋 Audit dadakan! Ahok Suzuki menghampiri ${target.def.name}`, 'event')
      sim.interrupt('ahok', {
        activity: 'visit',
        label: `Audit ${target.def.name}`,
        dest: { x: target.x + 3.4, y: target.y + 1.4 },
        faceTo: target.def.id,
        dur: 8000,
        effect: '🔍',
        onArrive: () => {
          sim.say('ahok', 'Selamat siang. Boleh lihat dokumennya? 🔍')
          sim.after(2400, () => {
            sim.flash(target.def.id, 'fire')
            sim.say(target.def.id, target.def.id === 'gema' ? 'Eh… sebentar, kuacinya kusingkirkan dulu 😅' : 'Ada kok… sebentar dicari 😰')
          })
        },
      })
    },
  },
  {
    id: 'standup',
    title: 'Standup dadakan',
    run: sim => {
      const mark = sim.get('mark')
      if (mark.phase === 'hidden') return
      const crew = shuffle(sim.rng, sim.active().filter(a => a !== mark)).slice(0, 3)
      sim.log(null, `🗣️ Mark Zulkarnain memanggil standup: ${crew.map(c => c.def.name).join(', ')}`, 'event')
      const c = spotById('spot-meeting')
      const ring = [{ x: 0, y: -3.2 }, { x: 5.5, y: 0 }, { x: 0, y: 3.2 }, { x: -5.5, y: 0 }]
      sim.interrupt('mark', { activity: 'meeting', label: 'Memimpin standup', dest: { x: c.x + ring[0].x, y: c.y + ring[0].y }, faceTo: crew[0]?.def.id, dur: 16000, effect: '🗣️', line: 'Standup! Kumpul 5 menit 🗣️' })
      crew.forEach((a, i) => {
        sim.interrupt(a.def.id, {
          activity: 'meeting',
          label: 'Ikut standup',
          dest: { x: c.x + ring[i + 1].x, y: c.y + ring[i + 1].y },
          faceTo: 'mark',
          dur: 14000 - i * 1000,
          onArrive: () => sim.after(1000 + i * 2200, () => sim.say(a.def.id, `Update: ${pick(sim.rng, a.def.lines.work ?? ['aman'])}`)),
        })
      })
    },
  },
  {
    id: 'server-alert',
    title: 'Server alert',
    run: sim => {
      sim.log(null, `🖥️ Alert: CPU server ${Math.floor(between(sim.rng, 85, 99))}%`, 'event')
      const rack = spotById('spot-printer')
      sim.interrupt('anon', { activity: 'server', label: 'Tangani alert server', dest: rack, spot: rack, dur: 10000, effect: 'fire', line: 'Sudah di-handle.' })
      sim.after(1500, () => sim.say('elon', 'Bukan kodeku. Kayaknya. 👀'))
    },
  },
  {
    id: 'birthday',
    title: 'Ulang tahun',
    run: sim => {
      const who = pick(sim.rng, sim.active())
      if (!who) return
      sim.log(null, `🎂 Hari ini ulang tahun ${who.def.name}!`, 'event')
      sim.active().forEach(a => sim.flash(a.def.id, a === who ? 'cake' : 'party', 6000))
      sim.after(1500, () => sim.say('siti', 'Foto bareng dulu! 📸'))
      sim.after(3200, () => sim.say(who.def.id, 'Makasih semuaa 🥹'))
    },
  },
  {
    id: 'kuaci',
    title: 'Krisis kuaci',
    run: sim => {
      sim.log(null, '🌻 Stok kuaci kantor habis!', 'event')
      sim.flash('gema', 'fire', 6000)
      sim.say('gema', 'INI DARURAT 🚨 Siapa yang habisin?!')
      sim.after(2500, () => sim.say('ahok', 'Akan saya audit pemakaian kuaci. 🔍'))
    },
  },
  {
    id: 'viral',
    title: 'Konten viral',
    run: sim => {
      sim.log(null, '📈 Konten "Otomasi = Pulang Tepat Waktu" trending!', 'event')
      sim.flash('siti', 'party', 6000)
      sim.say('siti', 'FYP! 100rb views 🚀')
      sim.after(2000, () => {
        sim.flash('owner', 'star')
        sim.say('owner', 'Mantap Siti! ⭐')
      })
    },
  },
]
