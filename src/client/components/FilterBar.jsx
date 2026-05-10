import { useTheme } from '../App.jsx'

export default function FilterBar({ filters, onChange }) {
  const T = useTheme()
  const set = (k, v) => onChange({ ...filters, [k]: v })
  const active = filters.shift || filters.date_from || filters.date_to

  const pill = { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8 }
  const lbl  = { fontSize: 11, color: T.textDim, fontWeight: 500 }
  const inp  = { background: 'transparent', color: T.textMid, fontSize: 12, outline: 'none', cursor: 'pointer', border: 'none' }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: T.textDim, letterSpacing: '0.12em', textTransform: 'uppercase', marginRight: 4 }}>Filters</span>

      <div style={pill}>
        <svg style={{ width: 12, height: 12, color: T.textDim }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636" />
        </svg>
        <span style={lbl}>Shift</span>
        <select value={filters.shift} onChange={e => set('shift', e.target.value)} style={{ ...inp, background: 'transparent' }}>
          <option value="" style={{ background: T.surface }}>All</option>
          <option value="day" style={{ background: T.surface }}>Day</option>
          <option value="night" style={{ background: T.surface }}>Night</option>
        </select>
      </div>

      <div style={pill}>
        <span style={lbl}>From</span>
        <input type="date" value={filters.date_from} onChange={e => set('date_from', e.target.value)} style={inp} />
      </div>

      <div style={pill}>
        <span style={lbl}>To</span>
        <input type="date" value={filters.date_to} onChange={e => set('date_to', e.target.value)} style={inp} />
      </div>

      {active && (
        <button onClick={() => onChange({ shift: '', date_from: '', date_to: '' })}
          style={{ fontSize: 11, color: T.textDim, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
          onMouseEnter={e => e.target.style.color = T.textMid}
          onMouseLeave={e => e.target.style.color = T.textDim}>
          Clear
        </button>
      )}
    </div>
  )
}
