import { useTheme } from '../App.jsx'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return iso }
}

export default function HistoryPanel({ history, onLoad, onDelete }) {
  const T = useTheme()

  if (history.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', padding: '80px 0' }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: T.surface2, border: `1px solid ${T.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg style={{ width: 24, height: 24, color: T.textDim }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p style={{ fontSize: 15, fontWeight: 600, color: T.textMid, marginBottom: 8 }}>No history yet</p>
        <p style={{ fontSize: 13, color: T.textDim }}>Reports you generate will appear here automatically.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: '-0.01em' }}>Report History</h2>
          <p style={{ fontSize: 12, color: T.textDim, marginTop: 4 }}>{history.length} report{history.length !== 1 ? 's' : ''} saved locally</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {history.map((entry, i) => {
          const totalIncidents = (entry.overall_table || []).reduce((s, r) => s + (r['Total Incidents'] !== '--' ? Number(r['Total Incidents']) : 0), 0)
          const breaches = (entry.customer_table || []).filter(r => String(r.IMR).includes('breached')).length
          const teams = [...new Set((entry.customer_table || []).map(r => r.Team))].length

          return (
            <div key={entry.id}
              style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 20 }}>

              {/* Index */}
              <div style={{ width: 32, height: 32, borderRadius: 8, background: T.surface2, border: `1px solid ${T.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.textDim }}>{i + 1}</span>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.reportInfo?.shiftName || entry.fileName || 'Unnamed report'}
                  </p>
                  {entry.reportInfo?.engineer && (
                    <span style={{ fontSize: 11, color: T.textDim, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 20, padding: '1px 8px', flexShrink: 0 }}>
                      {entry.reportInfo.engineer}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: T.textDim }}>{formatDate(entry.timestamp)}</span>
                  {entry.reportInfo?.date && entry.reportInfo.date !== entry.timestamp?.slice(0, 10) && (
                    <span style={{ fontSize: 11, color: T.textDim }}>Shift: {entry.reportInfo.date}</span>
                  )}
                  <span style={{ fontSize: 11, color: T.amber, fontVariantNumeric: 'tabular-nums' }}>{totalIncidents} incidents</span>
                  <span style={{ fontSize: 11, color: T.textDim }}>{teams} team{teams !== 1 ? 's' : ''}</span>
                  {breaches > 0 && (
                    <span style={{ fontSize: 11, color: T.red, fontWeight: 600 }}>{breaches} SLA breach{breaches !== 1 ? 'es' : ''}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <button onClick={() => onLoad(entry)}
                  style={{ fontSize: 12, fontWeight: 600, color: T.amber, background: T.amberBg, border: `1px solid ${T.amberBorder}`, borderRadius: 7, padding: '6px 14px', cursor: 'pointer', transition: 'all 0.15s' }}>
                  View
                </button>
                <button onClick={() => onDelete(entry.id)}
                  style={{ fontSize: 12, color: T.textDim, background: 'none', border: `1px solid ${T.border}`, borderRadius: 7, padding: '6px 10px', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = T.red}
                  onMouseLeave={e => e.currentTarget.style.color = T.textDim}>
                  ×
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
