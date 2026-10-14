import type { AgentRT } from '../sim/engine'
import { asset } from '../asset'

interface Props {
  agent: AgentRT
  selected: boolean
  onSelect: (id: string) => void
}

export function Icon({ icon, className }: { icon: string; className?: string }) {
  return /^[a-z-]+$/.test(icon)
    ? <img className={className} src={asset(`sprites/effects/${icon}.png`)} alt={icon} draggable={false} />
    : <span className={`${className ?? ''} emoji`}>{icon}</span>
}

export default function Character({ agent: a, selected, onSelect }: Props) {
  if (a.phase === 'hidden') return null
  const moving = a.phase === 'moving'
  const atDesk = !moving && a.plan.spot?.type === 'desk'
  const zIndex = atDesk ? a.plan.spot!.zIndex! : Math.round(a.y)
  const icon = a.flash?.icon ?? (!moving ? a.plan.effect : undefined)

  return (
    <div
      className={`char${moving ? ' moving' : ''}${selected ? ' selected' : ''}${a.plan.activity === 'sleep' ? ' sleeping' : ''}`}
      style={{ left: `${a.x}%`, top: `${a.y}%`, zIndex: 100 + zIndex, ['--c' as string]: a.def.color }}
      onClick={() => onSelect(a.def.id)}
      title={`${a.def.name} — ${a.def.role}`}
    >
      {a.bubble && <div key={a.bubble.text} className="bubble">{a.bubble.text}</div>}
      {!a.bubble && icon && <div className="fx"><Icon icon={icon} /></div>}
      <div className="char-shadow" />
      <img className="char-sprite" src={asset(`sprites/characters/${a.def.sprite}-${a.facing}.png`)} alt={a.def.name} draggable={false} />
      <div className="nametag">
        <b>{a.def.name}</b>
        <span>{a.def.role}</span>
      </div>
    </div>
  )
}
