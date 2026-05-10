import { useState } from 'react'
import { useTheme } from '../App.jsx'

export default function CopyButton({ tableRef, text }) {
  const T = useTheme()
  const [state, setState] = useState('idle')

  async function handleCopy() {
    try {
      let html = ''
      if (tableRef?.current) {
        const headers = Array.from(tableRef.current.querySelectorAll('thead th')).map(th => th.innerText)
        const rows = Array.from(tableRef.current.querySelectorAll('tbody tr')).map(tr =>
          Array.from(tr.querySelectorAll('td')).map(td => td.innerText)
        )
        const th = 'border:1px solid #d1c4b0;padding:7px 12px;background:#5c4030;color:#f5f0e8;text-align:left;font-family:Calibri,Arial,sans-serif;font-size:11pt;font-weight:600;white-space:nowrap;'
        const td0 = 'border:1px solid #e8e0d0;padding:7px 12px;color:#2c2018;text-align:left;font-family:Calibri,Arial,sans-serif;font-size:11pt;white-space:nowrap;'
        const td1 = 'border:1px solid #e8e0d0;padding:7px 12px;color:#2c2018;background:#faf7f2;text-align:left;font-family:Calibri,Arial,sans-serif;font-size:11pt;white-space:nowrap;'
        html = `<html><body><table style="border-collapse:collapse;">
          <thead><tr>${headers.map(h => `<th style="${th}">${h}</th>`).join('')}</tr></thead>
          <tbody>${rows.map((cells, i) => `<tr>${cells.map(c => `<td style="${i % 2 === 0 ? td0 : td1}">${c}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></body></html>`
      }
      if (html && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' }),
        })])
      } else {
        await navigator.clipboard.writeText(text)
      }
      setState('copied')
    } catch { setState('failed') }
    finally { setTimeout(() => setState('idle'), 2000) }
  }

  const styles = {
    idle:   { background: T.surface2, border: `1px solid ${T.border}`, color: T.textDim },
    copied: { background: T.greenBg,  border: `1px solid ${T.greenBorder}`, color: T.green },
    failed: { background: T.redBg,    border: `1px solid ${T.redBorder}`,   color: T.red },
  }

  return (
    <button onClick={handleCopy}
      style={{ ...styles[state], padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.02em' }}
      onMouseEnter={e => { if (state === 'idle') e.currentTarget.style.color = T.textMid }}
      onMouseLeave={e => { if (state === 'idle') e.currentTarget.style.color = T.textDim }}>
      {state === 'copied' ? '✓ Copied' : state === 'failed' ? '✗ Failed' : 'Copy'}
    </button>
  )
}
