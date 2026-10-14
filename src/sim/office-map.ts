// Peta ruang kantor (koordinat % terhadap gambar ruangan 4800x3584).
// Spot, furnitur, dan waypoint di-port dari W17ant/Claude-Office (MIT) — src/rooms.ts main-office.

export type Facing = 'front-left' | 'front-right' | 'rear-left' | 'rear-right'

export interface Pt {
  x: number
  y: number
}

export interface Spot extends Pt {
  id: string
  type: 'desk' | 'coffee' | 'water' | 'filing' | 'printer' | 'door' | 'kanban' | 'meeting'
  facing: Facing
  zIndex?: number
  label: string
}

export const SPOTS: Spot[] = [
  { id: 'spot-1', type: 'desk', x: 25.8, y: 71, facing: 'rear-left', zIndex: 85, label: 'Meja 1' },
  { id: 'spot-2', type: 'desk', x: 37.9, y: 68.2, facing: 'rear-right', zIndex: 85, label: 'Meja 2' },
  { id: 'spot-3', type: 'desk', x: 26.9, y: 59.2, facing: 'front-left', zIndex: 40, label: 'Meja 3' },
  { id: 'spot-4', type: 'desk', x: 38.5, y: 55.2, facing: 'rear-left', zIndex: 58, label: 'Meja 4' },
  { id: 'spot-5', type: 'desk', x: 48.9, y: 52.9, facing: 'rear-right', zIndex: 70, label: 'Meja Owner' },
  { id: 'spot-6', type: 'desk', x: 38.8, y: 43.6, facing: 'front-left', zIndex: 30, label: 'Meja 6' },
  { id: 'spot-7', type: 'desk', x: 52.7, y: 78.8, facing: 'rear-left', zIndex: 95, label: 'Meja 7' },
  { id: 'spot-8', type: 'desk', x: 65.9, y: 75.8, facing: 'rear-right', zIndex: 95, label: 'Meja 8' },
  { id: 'spot-9', type: 'desk', x: 55.2, y: 66.8, facing: 'front-left', zIndex: 55, label: 'Meja 9' },
  { id: 'spot-10', type: 'desk', x: 68.7, y: 66.2, facing: 'front-right', zIndex: 55, label: 'Meja 10' },
  { id: 'spot-coffee-1', type: 'coffee', x: 73.5, y: 56.7, facing: 'rear-left', label: 'Pantry' },
  { id: 'spot-coffee-2', type: 'coffee', x: 76.2, y: 58.4, facing: 'front-right', label: 'Pantry' },
  { id: 'spot-water-1', type: 'water', x: 53.3, y: 46.6, facing: 'rear-left', label: 'Dispenser' },
  { id: 'spot-water-2', type: 'water', x: 56, y: 47.7, facing: 'front-right', label: 'Dispenser' },
  { id: 'spot-filing', type: 'filing', x: 47.8, y: 57.6, facing: 'front-right', zIndex: 70, label: 'Lemari Arsip' },
  { id: 'spot-printer', type: 'printer', x: 81, y: 63, facing: 'rear-left', label: 'Printer & Rak Server' },
  { id: 'spot-door-2', type: 'door', x: 64, y: 46.6, facing: 'rear-right', label: 'Lorong' },
  { id: 'spot-door-3', type: 'door', x: 69.9, y: 50.8, facing: 'front-right', label: 'Lorong' },
  { id: 'spot-kanban', type: 'kanban', x: 77.5, y: 54.8, facing: 'front-right', label: 'Papan Kanban' },
  { id: 'spot-meeting', type: 'meeting', x: 41, y: 81, facing: 'rear-left', label: 'Area Standup' },
]

export const spotById = (id: string) => SPOTS.find(s => s.id === id)!

export interface Furniture extends Pt {
  id: string
  src: string
  /** tinggi tampilan dalam px pada lebar ruangan 800px (diskalakan via cqw) */
  h: number
  zIndex?: number
}

export const FURNITURE: Furniture[] = [
  { id: 'desk-1a', src: 'standing-desk-left-rear', x: 42.4, y: 50.4, h: 102 },
  { id: 'desk-1b', src: 'standing-desk-left-front', x: 46.7, y: 53, h: 106 },
  { id: 'desk-1c', src: 'standing-desk-right-front', x: 39.9, y: 55.2, h: 106 },
  { id: 'desk-2a', src: 'standing-desk-left-rear', x: 31.4, y: 64.8, h: 102 },
  { id: 'desk-2b', src: 'standing-desk-left-front', x: 35.4, y: 67.5, h: 106 },
  { id: 'desk-2c', src: 'standing-desk-right-front', x: 27.9, y: 70, h: 106 },
  { id: 'desk-3a', src: 'standing-desk-left-rear', x: 59, y: 73.7, h: 102 },
  { id: 'desk-3b', src: 'standing-desk-left-front', x: 62.6, y: 76, h: 106 },
  { id: 'desk-3c', src: 'standing-desk-right-front', x: 55.4, y: 78.7, h: 106 },
  { id: 'desk-3d', src: 'standing-desk-right-rear', x: 66.6, y: 71.1, h: 102 },
  { id: 'coffee', src: 'coffee-on', x: 78.5, y: 50.2, h: 51 },
  { id: 'filing', src: 'filling-closed', x: 45, y: 56.5, h: 56 },
  { id: 'plant-1', src: 'monstera-plant', x: 91.9, y: 64.7, h: 71 },
  { id: 'plant-2', src: 'snake-plant', x: 43.2, y: 37.9, h: 63 },
  { id: 'plant-3', src: 'money-tree', x: 32, y: 71.2, h: 63 },
  { id: 'plant-4', src: 'money-tree', x: 89.2, y: 65.7, h: 63 },
  { id: 'plant-5', src: 'monstera-plant', x: 60.2, y: 80.4, h: 71 },
  { id: 'printer', src: 'printer-working', x: 85.4, y: 56.8, h: 69 },
]

interface Waypoint extends Pt {
  id: string
  to: string[]
}

const WAYPOINTS: Waypoint[] = [
  { id: 'W-door', x: 67.5, y: 48.9, to: ['W-door-2', 'W-door-3'] },
  { id: 'W-door-2', x: 64, y: 46.6, to: ['W-door', 'W-water-1', 'W-new-6'] },
  { id: 'W-door-3', x: 69.9, y: 50.8, to: ['W-door', 'W-coffee-1', 'W-spot-10', 'W-new-7'] },
  { id: 'W-water-1', x: 53.3, y: 46.6, to: ['W-door-2', 'W-water-2', 'W-spot-5'] },
  { id: 'W-water-2', x: 56, y: 47.7, to: ['W-water-1', 'W-door-2', 'W-new-10'] },
  { id: 'W-spot-6', x: 38.8, y: 43.6, to: ['W-spot-4', 'W-water-1'] },
  { id: 'W-spot-4', x: 38.5, y: 55.2, to: ['W-spot-6', 'W-spot-5', 'W-spot-3', 'W-filing', 'W-new-19'] },
  { id: 'W-spot-5', x: 48.9, y: 52.9, to: ['W-spot-4', 'W-water-1', 'W-filing', 'W-spot-9'] },
  { id: 'W-filing', x: 47.8, y: 57.6, to: ['W-spot-4', 'W-spot-5', 'W-spot-9', 'W-new-4'] },
  { id: 'W-spot-3', x: 26.9, y: 59.2, to: ['W-spot-4', 'W-spot-1'] },
  { id: 'W-spot-1', x: 25.8, y: 71, to: ['W-spot-3', 'W-spot-2', 'W-new-12'] },
  { id: 'W-spot-2', x: 37.9, y: 68.2, to: ['W-spot-1', 'W-spot-4', 'W-spot-7'] },
  { id: 'W-spot-9', x: 55.2, y: 66.8, to: ['W-filing', 'W-spot-5', 'W-spot-7', 'W-spot-10'] },
  { id: 'W-spot-10', x: 68.7, y: 66.2, to: ['W-spot-9', 'W-spot-8', 'W-door-3', 'W-coffee-1'] },
  { id: 'W-spot-7', x: 52.7, y: 78.8, to: ['W-spot-9', 'W-spot-2', 'W-spot-8'] },
  { id: 'W-spot-8', x: 65.9, y: 75.8, to: ['W-spot-7', 'W-spot-10', 'W-new-22'] },
  { id: 'W-coffee-1', x: 73.5, y: 56.7, to: ['W-door-3', 'W-coffee-2', 'W-spot-10', 'W-kanban'] },
  { id: 'W-coffee-2', x: 76.2, y: 58.4, to: ['W-coffee-1', 'W-printer', 'W-kanban'] },
  { id: 'W-kanban', x: 77.5, y: 54.8, to: ['W-coffee-1', 'W-coffee-2'] },
  { id: 'W-meeting', x: 41, y: 81, to: ['W-new-12', 'W-new-14', 'W-spot-7'] },
  { id: 'W-printer', x: 81, y: 63, to: ['W-coffee-2', 'W-new-24'] },
  { id: 'W-new-4', x: 44.3, y: 63.3, to: ['W-filing', 'W-new-14'] },
  { id: 'W-new-6', x: 57, y: 52.2, to: ['W-door-2'] },
  { id: 'W-new-7', x: 63.9, y: 46.8, to: ['W-door-3'] },
  { id: 'W-new-10', x: 55.6, y: 49.2, to: ['W-water-2'] },
  { id: 'W-new-12', x: 36.3, y: 76.8, to: ['W-spot-1', 'W-new-13'] },
  { id: 'W-new-13', x: 25.8, y: 72.2, to: ['W-new-12', 'W-new-16'] },
  { id: 'W-new-14', x: 36.9, y: 76.7, to: ['W-new-4'] },
  { id: 'W-new-16', x: 18.5, y: 59.5, to: ['W-new-13', 'W-new-18'] },
  { id: 'W-new-18', x: 29.9, y: 47.1, to: ['W-new-16', 'W-new-20'] },
  { id: 'W-new-19', x: 18.3, y: 57.7, to: ['W-spot-4'] },
  { id: 'W-new-20', x: 38.8, y: 54.2, to: ['W-new-18'] },
  { id: 'W-new-22', x: 76.3, y: 70.5, to: ['W-spot-8', 'W-new-24'] },
  { id: 'W-new-24', x: 81.3, y: 62.5, to: ['W-new-22'] },
]

// Graf tak berarah: tambahkan sisi balik karena data referensi sebagian satu arah.
const GRAPH = new Map<string, Set<string>>()
for (const w of WAYPOINTS) {
  if (!GRAPH.has(w.id)) GRAPH.set(w.id, new Set())
  for (const t of w.to) {
    GRAPH.get(w.id)!.add(t)
    if (!GRAPH.has(t)) GRAPH.set(t, new Set())
    GRAPH.get(t)!.add(w.id)
  }
}
const WP = new Map(WAYPOINTS.map(w => [w.id, w]))

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y)

function nearestWaypoint(p: Pt): Waypoint {
  let best = WAYPOINTS[0]
  for (const w of WAYPOINTS) if (dist(w, p) < dist(best, p)) best = w
  return best
}

/** Rute terpendek (Dijkstra) dari `from` ke `to` melalui waypoint lorong. */
export function findPath(from: Pt, to: Pt): Pt[] {
  if (dist(from, to) < 4) return [to]
  const start = nearestWaypoint(from)
  const goal = nearestWaypoint(to)
  const d = new Map<string, number>([[start.id, 0]])
  const prev = new Map<string, string>()
  const open = new Set([start.id])
  while (open.size) {
    let cur = ''
    for (const id of open) if (!cur || d.get(id)! < d.get(cur)!) cur = id
    open.delete(cur)
    if (cur === goal.id) break
    for (const n of GRAPH.get(cur) ?? []) {
      const nd = d.get(cur)! + dist(WP.get(cur)!, WP.get(n)!)
      if (nd < (d.get(n) ?? Infinity)) {
        d.set(n, nd)
        prev.set(n, cur)
        open.add(n)
      }
    }
  }
  const chain: Pt[] = []
  if (d.has(goal.id)) {
    for (let id: string | undefined = goal.id; id; id = prev.get(id)) chain.unshift(WP.get(id)!)
  }
  // Lewati waypoint pertama bila justru membuat agent mundur.
  if (chain.length > 1 && dist(from, chain[1]) < dist(chain[0], chain[1])) chain.shift()
  return [...chain.map(w => ({ x: w.x, y: w.y })), to]
}
