import { useState } from 'react'
import { useTheme } from '../App.jsx'

export default function ValidationReport({ rejectedRows }) {
  const T = useTheme()
  const [open, setOpen] = useState(false)
  if (!rejectedRows?.length) return null

  return (
    <div style={{ marginBottom: 20, borderRadius: 12, overflow: 'hidden', background: T.id === 'dark' ? '#1a1208' : '#fffbf0', border: `1px solid ${T.amber}30` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg style={{ width: 14, height: 14, color: T.amber, flexShrink: 0 }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.amber }}>
            {rejectedRows.length} row{rejectedRows.length !== 1 ? 's' : ''} rejected
          </span>
          <span style={{ fontSize: 11, color: T.textDim }}>data quality issues</span>
        </div>
        <button onClick={() => setOpen(p => !p)}
          style={{ fontSize: 11, color: T.textDim, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.target.style.color = T.amber}
          onMouseLeave={e => e.target.style.color = T.textDim}>
          {open ? 'Hide' : 'Show details'}
        </button>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${T.amber}18`, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {rejectedRows.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, fontSize: 11 }}>
              <span style={{ color: T.amber, width: 52, flexShrink: 0, fontVariantNumeric: 'tabular-nums', opacity: 0.7 }}>Row {r.row_index}</span>
              <span style={{ color: T.textDim, width: 96, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.counter_id ?? 'N/A'}</span>
              <span style={{ color: T.textMid }}>{r.reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
