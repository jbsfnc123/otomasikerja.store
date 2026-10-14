// PRNG ber-seed (mulberry32) — `?seed=123` di URL membuat demo bisa diulang persis.
export type Rng = () => number

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function seedFromUrl(): number {
  const raw = new URLSearchParams(window.location.search).get('seed')
  const n = raw ? Number(raw) : NaN
  return Number.isFinite(n) ? n : Math.floor(Math.random() * 2 ** 31)
}

export const between = (rng: Rng, min: number, max: number) => min + rng() * (max - min)

export function pick<T>(rng: Rng, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length)]
}

export function pickWeighted<K extends string>(rng: Rng, weights: Partial<Record<K, number>>): K {
  const entries = Object.entries(weights).filter(([, w]) => (w as number) > 0) as [K, number][]
  const total = entries.reduce((s, [, w]) => s + w, 0)
  let r = rng() * total
  for (const [k, w] of entries) {
    r -= w
    if (r <= 0) return k
  }
  return entries[entries.length - 1][0]
}

export function shuffle<T>(rng: Rng, list: T[]): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
