import { useTheme } from '../App.jsx'

/**
 * ReportHeader — shift name, engineer, date fields shown before upload.
 * These get embedded in the report summary and saved to history.
 */
export default function ReportHeader({ info, onChange }) {
  const T = useTheme()
  const set = (k, v) => onChange({ ...info, [k]: v })

  const inputStyle = {
    background: T.surface2,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    color: T.text,
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.15s',
  }

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: T.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
        Report Details
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: T.textDim, marginBottom: 6 }}>Shift Name</label>
          <input
            type="text"
            placeholder="e.g. Night Shift, Morning Shift"
            value={info.shiftName}
            onChange={e => set('shiftName', e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = T.amber}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: T.textDim, marginBottom: 6 }}>Date</label>
          <input
            type="date"
            value={info.date}
            onChange={e => set('date', e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = T.amber}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: T.textDim, marginBottom: 6 }}>Engineer on Duty</label>
          <input
            type="text"
            placeholder="Your name"
            value={info.engineer}
            onChange={e => set('engineer', e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = T.amber}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </div>
      </div>
    </div>
  )
}
