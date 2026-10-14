// Mesin simulasi kantor: state machine per agent + pemilihan aktivitas weighted-random.
// Gimmick murni — tidak ada data nyata yang dibaca/ditulis.

import { AGENTS, AgentDef, ActivityId, agentById } from '../agents'
import { Facing, Pt, Spot, SPOTS, findPath, spotById } from './office-map'
import { Rng, between, mulberry32, pick, pickWeighted } from './rng'
import { OFFICE_EVENTS } from './events'

const WALK_SPEED = 7 // % lebar ruangan per detik
const FEED_CAP = 120
const DOOR: Pt = { x: 67.5, y: 48.9 }

interface ActivitySpec {
  label: string
  place: Spot['type'] | 'agent' | 'random'
  dur: [number, number]
  effect?: string
}

export const ACTIVITIES: Record<ActivityId, ActivitySpec> = {
  work: { label: 'Fokus kerja', place: 'desk', dur: [10, 24], effect: 'typing' },
  coffee: { label: 'Ngopi di pantry', place: 'coffee', dur: [6, 10], effect: 'need-coffee' },
  water: { label: 'Ambil minum', place: 'water', dur: [4, 7], effect: 'glass-water' },
  snack: { label: 'Ngemil kuaci', place: 'desk', dur: [6, 12], effect: '🌻' },
  filing: { label: 'Bongkar arsip', place: 'filing', dur: [6, 10], effect: 'post-it' },
  server: { label: 'Cek rak server', place: 'printer', dur: [7, 12], effect: '🖥️' },
  kanban: { label: 'Update papan kanban', place: 'kanban', dur: [6, 10], effect: 'post-it' },
  phone: { label: 'Telepon di lorong', place: 'door', dur: [7, 12], effect: '📞' },
  visit: { label: 'Menghampiri rekan', place: 'agent', dur: [6, 9] },
  sleep: { label: 'Tertidur', place: 'desk', dur: [8, 15], effect: 'sleeping' },
  wander: { label: 'Jalan-jalan', place: 'random', dur: [2, 4] },
}

export interface Plan {
  activity: string
  label: string
  dest: Pt
  spot?: Spot
  faceTo?: string
  dur: number
  effect?: string
  line?: string
  onArrive?: () => void
}

export interface AgentRT {
  def: AgentDef
  x: number
  y: number
  path: Pt[]
  facing: Facing
  phase: 'hidden' | 'moving' | 'doing'
  plan: Plan
  until: number
  reserved?: string
  bubble?: { text: string; until: number }
  flash?: { icon: string; until: number }
  turned: boolean
  nextFidget: number
  history: { at: number; text: string }[]
}

export interface FeedItem {
  id: number
  at: number
  who: string | null
  text: string
  kind: 'chat' | 'event' | 'status'
}

export interface Stats {
  orders: number
  deploys: number
  coffee: number
  kuaci: number
}

export class OfficeSim {
  readonly rng: Rng
  readonly seed: number
  now = 0
  night = false
  agents: AgentRT[]
  feed: FeedItem[] = []
  feedVersion = 0
  stats: Stats = { orders: 0, deploys: 0, coffee: 0, kuaci: 0 }
  private feedId = 0
  private timers: { at: number; fn: () => void }[] = []
  private nextEvent: number

  constructor(seed: number) {
    this.seed = seed
    this.rng = mulberry32(seed)
    this.agents = AGENTS.map((def, i) => {
      const desk = spotById(def.desk)
      const a: AgentRT = {
        def,
        ...DOOR,
        path: [],
        facing: 'rear-left',
        phase: 'hidden',
        plan: { activity: 'arrive', label: 'Baru datang', dest: desk, spot: desk, dur: 3 },
        until: 0,
        turned: false,
        nextFidget: 0,
        history: [],
      }
      this.after(800 + i * 1400, () => {
        a.phase = 'doing'
        this.goDo(a, { ...a.plan, line: pick(this.rng, ['Pagi semua! 👋', 'Hadir ✋', 'Halo tim!', 'Sudah sampai 🙌']) })
      })
      return a
    })
    this.nextEvent = 25_000
    this.log(null, '🏢 Kantor virtual otomatisasi.store dibuka. Semua aktivitas di sini adalah simulasi.', 'event')
  }

  // ---------------------------------------------------------------- helpers

  get(id: string) {
    return this.agents.find(a => a.def.id === id)!
  }

  after(ms: number, fn: () => void) {
    this.timers.push({ at: this.now + ms, fn })
  }

  log(who: string | null, text: string, kind: FeedItem['kind'] = 'chat') {
    this.feed.push({ id: ++this.feedId, at: Date.now(), who, text, kind })
    if (this.feed.length > FEED_CAP) this.feed.splice(0, this.feed.length - FEED_CAP)
    this.feedVersion++
    if (who) {
      const a = this.get(who)
      a.history.unshift({ at: Date.now(), text })
      a.history.length = Math.min(a.history.length, 5)
    }
  }

  say(id: string, text: string, ms = 3800) {
    const a = this.get(id)
    if (a.phase === 'hidden') return
    a.bubble = { text, until: this.now + ms }
    this.log(id, text)
  }

  flash(id: string, icon: string, ms = 4000) {
    const a = this.get(id)
    if (a.phase === 'hidden') return
    a.flash = { icon, until: this.now + ms }
  }

  active() {
    return this.agents.filter(a => a.phase !== 'hidden')
  }

  // ---------------------------------------------------------------- planning

  goDo(a: AgentRT, plan: Plan) {
    if (a.reserved) a.reserved = undefined
    if (plan.spot && plan.spot.type !== 'desk') a.reserved = plan.spot.id
    a.plan = plan
    a.turned = false
    a.path = findPath(a, plan.dest)
    a.phase = 'moving'
  }

  /** Paksa agent beralih ke rencana baru (dipakai event kantor). */
  interrupt(id: string, plan: Plan) {
    const a = this.get(id)
    if (a.phase === 'hidden') return
    this.goDo(a, plan)
  }

  deskPlan(a: AgentRT, act: ActivityId = 'work'): Plan {
    const spec = ACTIVITIES[act]
    const desk = spotById(a.def.desk)
    return { activity: act, label: spec.label, dest: desk, spot: desk, dur: between(this.rng, ...spec.dur) * 1000, effect: spec.effect }
  }

  private freeSpot(type: Spot['type'], self: AgentRT): { spot: Spot; dest: Pt } {
    const taken = new Set(this.agents.filter(o => o !== self).map(o => o.reserved))
    const all = SPOTS.filter(s => s.type === type)
    const free = all.filter(s => !taken.has(s.id))
    const spot = pick(this.rng, free.length ? free : all)
    const jitter = free.length ? 0 : 2.5
    return { spot, dest: { x: spot.x + between(this.rng, -jitter, jitter), y: spot.y + between(this.rng, -jitter / 2, jitter / 2) } }
  }

  private visitPlan(a: AgentRT): Plan | null {
    const others = this.active().filter(o => o !== a && o.plan.activity !== 'visit' && o.plan.activity !== 'meeting')
    if (!others.length) return null
    const t = pick(this.rng, others)
    const side = this.rng() < 0.5 ? -1 : 1
    const isOwner = a.def.id === 'owner'
    return {
      activity: 'visit',
      label: `Ngobrol dengan ${t.def.name}`,
      dest: { x: t.x + side * 3.6, y: t.y + 1.4 },
      faceTo: t.def.id,
      dur: between(this.rng, ...ACTIVITIES.visit.dur) * 1000,
      onArrive: () => {
        this.say(a.def.id, pick(this.rng, a.def.chat).replace('{name}', t.def.name.split(' ')[0]))
        if (isOwner) this.flash(a.def.id, pick(this.rng, ['thumb-up', 'star', 'fire']))
        this.after(2600, () => {
          t.turned = false
          t.facing = faceToward(t, a)
          this.say(t.def.id, pick(this.rng, t.def.replies))
        })
      },
    }
  }

  chooseNext(a: AgentRT): Plan {
    const w: Partial<Record<ActivityId, number>> = { ...a.def.traits }
    if (this.night) for (const [k, v] of Object.entries(a.def.nightTraits ?? {})) w[k as ActivityId] = (w[k as ActivityId] ?? 0) + v
    if (this.night) w.sleep = (w.sleep ?? 0) + 0.6
    // Habis aktivitas non-kerja → condong kembali ke meja; hindari mengulang hal yang sama.
    if (a.plan.activity !== 'work') w.work = (w.work ?? 0) + 3
    const prev = a.plan.activity as ActivityId
    if (prev !== 'work' && w[prev]) w[prev] = w[prev]! * 0.25
    for (const k of Object.keys(w) as ActivityId[]) w[k] = Math.max(0, w[k]!) * between(this.rng, 0.7, 1.3)

    const act = pickWeighted(this.rng, w)
    const spec = ACTIVITIES[act]
    const dur = between(this.rng, ...spec.dur) * 1000
    const line = this.rng() < 0.55 ? pickLine(this.rng, a.def, act) : undefined

    if (act === 'snack') this.stats.kuaci += Math.floor(between(this.rng, 20, 120))
    if (act === 'coffee') this.stats.coffee++

    if (spec.place === 'desk') return { ...this.deskPlan(a, act), dur, line }
    if (spec.place === 'agent') return this.visitPlan(a) ?? this.deskPlan(a)
    if (spec.place === 'random') {
      const dest = pick(this.rng, SPOTS)
      return { activity: act, label: spec.label, dest: { x: dest.x + 2, y: dest.y + 2 }, dur, line }
    }
    const { spot, dest } = this.freeSpot(spec.place, a)
    return { activity: act, label: spec.label, dest, spot, dur, effect: spec.effect, line }
  }

  // ---------------------------------------------------------------- loop

  update(dtMs: number) {
    this.now += dtMs
    const dt = dtMs / 1000

    // timer terjadwal
    const due = this.timers.filter(t => t.at <= this.now)
    if (due.length) {
      this.timers = this.timers.filter(t => t.at > this.now)
      due.forEach(t => t.fn())
    }

    for (const a of this.agents) {
      if (a.phase === 'hidden') continue
      if (a.bubble && a.bubble.until < this.now) a.bubble = undefined
      if (a.flash && a.flash.until < this.now) a.flash = undefined

      if (a.phase === 'moving') {
        let budget = WALK_SPEED * dt
        while (budget > 0 && a.path.length) {
          const t = a.path[0]
          const dx = t.x - a.x
          const dy = t.y - a.y
          const d = Math.hypot(dx, dy)
          if (d > 0.01) a.facing = facingFromDelta(dx, dy)
          if (d <= budget) {
            a.x = t.x
            a.y = t.y
            a.path.shift()
            budget -= d
          } else {
            a.x += (dx / d) * budget
            a.y += (dy / d) * budget
            budget = 0
          }
        }
        if (!a.path.length) this.arrive(a)
        continue
      }

      // doing
      if (a.plan.activity === 'work' && this.now > a.nextFidget) {
        // perilaku kecil acak di meja: menoleh / bergumam
        a.turned = !a.turned && this.rng() < 0.5
        a.facing = a.turned ? opposite(a.plan.spot!.facing) : a.plan.spot!.facing
        if (this.rng() < 0.18) this.say(a.def.id, pickLine(this.rng, a.def, 'work'))
        a.nextFidget = this.now + between(this.rng, 3000, 9000)
      }
      if (this.now >= a.until) this.goDo(a, this.chooseNext(a))
    }

    if (this.now >= this.nextEvent) {
      this.fireEvent()
      this.nextEvent = this.now + between(this.rng, 30_000, 75_000)
    }
  }

  private arrive(a: AgentRT) {
    const p = a.plan
    a.phase = 'doing'
    a.until = this.now + p.dur
    a.nextFidget = this.now + between(this.rng, 2000, 6000)
    if (p.faceTo) a.facing = faceToward(a, this.get(p.faceTo))
    else if (p.spot) a.facing = p.spot.facing
    if (p.line) this.say(a.def.id, p.line)
    p.onArrive?.()
  }

  fireEvent(id?: string) {
    const ev = id ? OFFICE_EVENTS.find(e => e.id === id)! : pick(this.rng, OFFICE_EVENTS)
    ev.run(this)
  }
}

// ---------------------------------------------------------------- utils

function pickLine(rng: Rng, def: AgentDef, act: ActivityId): string {
  const pool = def.lines[act] ?? def.lines.work ?? ['…']
  return pick(rng, pool)
}

// Arah sprite isometrik (logika dari Claude-Office Character.tsx).
export function facingFromDelta(dx: number, dy: number): Facing {
  if (dy < 0 && dx >= 0) return 'front-left'
  if (dy < 0 && dx < 0) return 'front-right'
  if (dx >= 0) return 'rear-left'
  return 'rear-right'
}

function faceToward(a: Pt, b: Pt): Facing {
  return facingFromDelta(b.x - a.x, b.y - a.y)
}

function opposite(f: Facing): Facing {
  return ({ 'front-left': 'rear-right', 'front-right': 'rear-left', 'rear-left': 'front-right', 'rear-right': 'front-left' } as const)[f]
}

export { agentById }
