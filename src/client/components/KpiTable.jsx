import { useRef, useState } from 'react'
import { useTheme } from '../App.jsx'
import CopyButton from './CopyButton.jsx'
import ExportMenu from './ExportMenu.jsx'

export default function KpiTable({ title, data, filename, accent = 'amber' }) {
  const T = useTheme()
  const tableRef = useRef(null)
  const tableText = data.map(row => Object.values(row).join('\t')).join('\n')
  const incidentCount = data.filter(r => r['Total Incidents'] !== '--').reduce((s, r) => s + Number(r['Total Incidents']), 0)
  const [expandedRow, setExpandedRow] = useState(null)

  // Guard: don't render if data is empty
  if (!data || data.length === 0) return null

  const accentColor  = accent === 'amber' ? T.amber  : T.sage
  const accentBg     = accent === 'amber' ? T.amberBg : T.sageBg
  const accentBorder = accent === 'amber' ? T.amberBorder : T.sageBorder

  return (
    <div style={{ marginBottom: 24, borderRadius: 10, overflow: 'hidden', background: T.surface, border: `1px solid ${T.border}`, boxShadow: T.shadow }}>

      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor, flexShrink: 0 }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: T.text, letterSpacing: '-0.01em' }}>{title}</span>
          {incidentCount > 0 && (
            <span style={{ fontSize: 11, color: T.textDim, background: T.surface2, border: `1px solid ${T.border2}`, borderRadius: 20, padding: '2px 9px', fontVariantNumeric: 'tabular-nums' }}>
              {incidentCount}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ExportMenu data={data} tableRef={tableRef} filename={filename} />
          <CopyButton tableRef={tableRef} text={tableText} />
        </div>
      </div>

      {/* Table — Grid Table 3 · Accent 1 (Office blue) */}
      <div style={{ overflowX: 'auto' }}>
        <table ref={tableRef} className="kpi-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#4472C4' }}>
              {Object.keys(data[0]).map(key => (
                <th key={key} style={{ padding: '4px 10px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#ffffff', letterSpacing: '0.06em', textTransform: 'uppercase', border: '1px solid #4472C4', whiteSpace: 'nowrap', fontFamily: 'Aptos, Calibri, Arial, sans-serif' }}>
                  {key}
                </th>
              ))}
              {/* Drill-down column */}
              <th style={{ padding: '4px 10px', border: '1px solid #4472C4', width: 32, background: '#4472C4' }} />
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const isExpanded = expandedRow === i
              const hasIncidents = row['Total Incidents'] !== '--' && Number(row['Total Incidents']) > 0
              const bandBg = i % 2 === 1 ? '#D9E1F2' : '#ffffff'
              const expandedBg = '#BDD0EE'
              return (
                <>
                  <tr key={i}
                    style={{ transition: 'background 0.1s', cursor: hasIncidents ? 'pointer' : 'default', background: isExpanded ? expandedBg : bandBg }}
                    onClick={() => hasIncidents && setExpandedRow(isExpanded ? null : i)}
                    onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = '#BDD0EE' }}
                    onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = isExpanded ? expandedBg : bandBg }}>
                    {Object.entries(row).map(([key, value], j) => (
                      <td key={j} style={{ padding: '4px 10px', whiteSpace: 'nowrap', fontSize: 12, fontFamily: 'Aptos, Calibri, Arial, sans-serif', border: '1px solid #4472C4', color: '#000000' }}>
                        {renderCell(key, value, j, T)}
                      </td>
                    ))}
                    <td style={{ padding: '4px 10px', textAlign: 'center', border: '1px solid #4472C4' }}>
                      {hasIncidents && (
                        <span style={{ fontSize: 10, color: '#4472C4', transition: 'transform 0.15s', display: 'inline-block', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                      )}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${i}-detail`} style={{ background: expandedBg }}>
                      <td colSpan={Object.keys(row).length + 1} style={{ padding: '12px 20px 16px', border: '1px solid #4472C4' }}>
                        <DrillDown row={row} accent='#4472C4' />
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DrillDown({ row, accent }) {
  const T = useTheme()
  const fields = Object.entries(row).filter(([k]) => !['Total Incidents'].includes(k))

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: T.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
        Row details
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {fields.map(([key, value]) => (
          <div key={key}>
            <p style={{ fontSize: 10, color: T.textDim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{key}</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{value === '--' ? '—' : value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function renderCell(key, value, j, T) {
  if (value === '--') return <span style={{ color: T.border2 }}>—</span>

  if (key === 'Severity') {
    const isSev1 = String(value).includes('1')
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 6, background: isSev1 ? T.redBg : T.amberBg, color: isSev1 ? T.red : T.amber, border: `1px solid ${isSev1 ? T.redBorder : T.amberBorder}` }}>
        {value}
      </span>
    )
  }

  if (key === 'IMR' || key === 'RCA') {
    const breached = String(value).includes('breached')
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: breached ? T.red : T.green }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: breached ? T.red : T.green, flexShrink: 0 }} />
        {value}
      </span>
    )
  }

  if (key === 'MTTA' || key === 'MTTR') {
    return <span style={{ color: T.monoColor, fontFamily: 'ui-monospace, monospace', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
  }

  if (j === 0) return <span style={{ color: T.text, fontWeight: 600 }}>{value}</span>
  return <span style={{ color: T.textMid }}>{value}</span>
}
