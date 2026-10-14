import { useEffect, useMemo, useRef, useState } from 'react'
import { OfficeSim } from './sim/engine'
import { seedFromUrl } from './sim/rng'
import { OFFICE_EVENTS } from './sim/events'
import Office from './components/Office'
import ActivityFeed from './components/ActivityFeed'
import ProfileCard from './components/ProfileCard'

type DayMode = 'auto' | 'day' | 'night'
const SPEEDS = [1, 2, 4]
const isNightHour = (d: Date) => d.getHours() < 6 || d.getHours() >= 18

export default function App() {
  const sim = useMemo(() => new OfficeSim(seedFromUrl()), [])
  const [, setFrame] = useState(0)
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [mode, setMode] = useState<DayMode>('auto')
  const [selected, setSelected] = useState<string | null>(null)
  const [feedOpen, setFeedOpen] = useState(false)
  const ctl = useRef({ paused, speed })
  ctl.current = { paused, speed }

  const now = new Date()
  const night = mode === 'auto' ? isNightHour(now) : mode === 'night'
  sim.night = night

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const loop = (t: number) => {
      const dt = Math.min(t - last, 100) // jaga agar tab yang lama di-background tidak "loncat"
      last = t
      if (!ctl.current.paused) sim.update(dt * ctl.current.speed)
      setFrame(f => (f + 1) % 1e6)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [sim])

  const sel = selected ? sim.get(selected) : null
  const s = sim.stats

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo">⚙️</span>
          <div>
            <b>otomatisasi<span>.store</span></b>
            <small>Kantor Virtual</small>
          </div>
        </div>
        <div className="sim-badge" title="Visualisasi ini hanya simulasi acak, bukan aktivitas nyata sistem.">● SIMULASI</div>
        <div className="stats">
          <span title="Order (gimmick)">🛒 {s.orders}</span>
          <span title="Deploy (gimmick)">🚀 {s.deploys}</span>
          <span title="Kopi diseduh">☕ {s.coffee}</span>
          <span title="Kuaci dimakan Gema">🌻 {s.kuaci}</span>
        </div>
        <div className="controls">
          <span className="clock">{now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
          <button onClick={() => setPaused(p => !p)}>{paused ? '▶︎ Lanjut' : '❚❚ Jeda'}</button>
          <button onClick={() => setSpeed(v => SPEEDS[(SPEEDS.indexOf(v) + 1) % SPEEDS.length])}>{speed}×</button>
          <button onClick={() => setMode(m => (m === 'auto' ? 'day' : m === 'day' ? 'night' : 'auto'))}>
            {mode === 'auto' ? (night ? '🌙 Auto' : '☀️ Auto') : mode === 'day' ? '☀️ Siang' : '🌙 Malam'}
          </button>
          <select
            value=""
            onChange={e => e.target.value && sim.fireEvent(e.target.value)}
            title="Picu event kantor"
          >
            <option value="">⚡ Event…</option>
            {OFFICE_EVENTS.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>
          <button className="feed-toggle" onClick={() => setFeedOpen(o => !o)}>💬</button>
        </div>
      </header>

      <main className="body">
        <section className="stage">
          <Office sim={sim} night={night} selected={selected} onSelect={setSelected} />
          {sel && <ProfileCard agent={sel} onClose={() => setSelected(null)} />}
          <div className="roster">
            {sim.agents.map(a => (
              <button key={a.def.id} className={selected === a.def.id ? 'on' : ''} style={{ ['--c' as string]: a.def.color }} onClick={() => setSelected(a.def.id)}>
                <i>{a.def.emoji}</i>
                <span><b>{a.def.name}</b><small>{a.phase === 'hidden' ? 'Belum datang' : a.plan.label}</small></span>
              </button>
            ))}
          </div>
        </section>
        <div className={`feed-wrap${feedOpen ? ' open' : ''}`}>
          <ActivityFeed items={sim.feed} version={sim.feedVersion} />
        </div>
      </main>
      <footer className="foot">
        Visualisasi ini hanya gimmick — perilaku agent dibuat acak dan tidak mencerminkan aktivitas nyata di otomatisasi.store.
        <span> · seed {sim.seed}</span>
      </footer>
    </div>
  )
}
