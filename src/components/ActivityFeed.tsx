import { memo, useEffect, useRef } from 'react'
import type { FeedItem } from '../sim/engine'
import { agentById } from '../agents'

const fmt = (t: number) => new Date(t).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

function ActivityFeed({ items }: { items: FeedItem[]; version: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 120) el.scrollTop = el.scrollHeight
  })

  return (
    <aside className="feed">
      <header className="feed-head">
        <span className="hash">#</span>kantor-otomasi
        <small>{items.length} pesan</small>
      </header>
      <div className="feed-list" ref={ref}>
        {items.map(it => {
          if (!it.who) return <div key={it.id} className="feed-event">{it.text}<time>{fmt(it.at)}</time></div>
          const a = agentById(it.who)
          return (
            <div key={it.id} className="feed-msg">
              <div className="avatar" style={{ background: a.color }}>{a.emoji}</div>
              <div>
                <div className="feed-meta"><b style={{ color: a.color }}>{a.name}</b><span>{a.role}</span><time>{fmt(it.at)}</time></div>
                <div className="feed-text">{it.text}</div>
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default memo(ActivityFeed, (p, n) => p.version === n.version)
