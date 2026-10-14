import type { OfficeSim } from '../sim/engine'
import { FURNITURE } from '../sim/office-map'
import { asset } from '../asset'
import Character from './Character'

interface Props {
  sim: OfficeSim
  night: boolean
  selected: string | null
  onSelect: (id: string | null) => void
}

export default function Office({ sim, night, selected, onSelect }: Props) {
  return (
    <div className="room" onClick={e => e.target === e.currentTarget && onSelect(null)}>
      <div className="room-bg" style={{ backgroundImage: `url(${asset('rooms/office-day.webp')})` }} />
      <div className="room-bg" style={{ backgroundImage: `url(${asset('rooms/office-night.webp')})`, opacity: night ? 1 : 0 }} />
      <div className="door-sign">OWNER · AI</div>
      <div className="window-brand">otomasikerja.store</div>
      {FURNITURE.map(f => (
        <img
          key={f.id}
          className="furniture"
          src={asset(`sprites/furniture/${f.src}.png`)}
          alt=""
          draggable={false}
          style={{ left: `${f.x}%`, top: `${f.y}%`, height: `${f.h / 8}cqw`, zIndex: 100 + (f.zIndex ?? Math.round(f.y)) }}
        />
      ))}
      {sim.agents.map(a => (
        <Character key={a.def.id} agent={a} selected={selected === a.def.id} onSelect={onSelect} />
      ))}
    </div>
  )
}
