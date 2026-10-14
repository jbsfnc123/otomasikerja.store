import type { AgentRT } from '../sim/engine'
import { asset } from '../asset'

export default function ProfileCard({ agent: a, onClose }: { agent: AgentRT; onClose: () => void }) {
  return (
    <div className="profile" style={{ ['--c' as string]: a.def.color }}>
      <button className="profile-close" onClick={onClose} aria-label="Tutup">×</button>
      <img src={asset(`sprites/characters/${a.def.sprite}-front-left.png`)} alt="" />
      <div className="profile-body">
        <h3>{a.def.emoji} {a.def.name}</h3>
        <div className="profile-role">{a.def.role}</div>
        <p>{a.def.bio}</p>
        <div className="profile-status">
          <span className={`dot ${a.phase}`} />
          {a.phase === 'moving' ? `Menuju: ${a.plan.label}` : a.plan.label}
        </div>
        {a.history.length > 0 && (
          <ul>
            {a.history.slice(0, 3).map(h => <li key={h.at + h.text}>“{h.text}”</li>)}
          </ul>
        )}
      </div>
    </div>
  )
}
