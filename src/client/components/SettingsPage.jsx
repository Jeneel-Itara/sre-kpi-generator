import { useState, useEffect } from 'react'
import { useTheme } from '../App.jsx'
import { getSettings, saveSettings } from '../services/api.js'

export default function SettingsPage() {
  const T = useTheme()
  const [settings, setSettings] = useState({ sla_sev1: 5, sla_sev2: 10, showSkippedCount: true })
  const [saveStatus, setSaveStatus] = useState('idle')

  useEffect(() => { getSettings().then(setSettings).catch(() => {}) }, [])

  function set(k, v) { setSettings(p => ({ ...p, [k]: v })); setSaveStatus('idle') }

  async function handleSave() {
    setSaveStatus('saving')
    try {
      const result = await saveSettings(settings)
      setSettings(result.settings)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch { setSaveStatus('error') }
  }

  const card = { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: 16, overflow: 'hidden', transition: 'background 0.25s' }
  const cardHead = { padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${T.border}`, background: T.id === 'dark' ? 'rgba(0,0,0,0.1)' : T.surface2 }
  const cardBody = { padding: '16px 20px' }
  const inputStyle = { width: '100%', background: T.bg, border: `1px solid ${T.border}`, color: T.text, borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', transition: 'border-color 0.15s' }

  return (
    <div className="slide-up" style={{ maxWidth: 500 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, letterSpacing: '-0.02em', lineHeight: 1 }}>Settings</h2>
        <p style={{ fontSize: 12, color: T.textDim, marginTop: 6 }}>Changes take effect immediately on the next KPI calculation.</p>
      </div>

      {/* SLA Thresholds */}
      <div style={card}>
        <div style={cardHead}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.amber, boxShadow: `0 0 8px ${T.amber}`, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: T.textDim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>SLA Thresholds</span>
        </div>
        <div style={cardBody}>
          <p style={{ fontSize: 11, color: T.textDim, marginBottom: 16 }}>Incidents where MTTR exceeds the threshold are flagged as IMR breached.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { key: 'sla_sev1', label: 'Severity 1 SLA', accent: T.red },
              { key: 'sla_sev2', label: 'Severity 2 SLA', accent: T.amber },
            ].map(({ key, label, accent }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: T.textDim, marginBottom: 6 }}>
                  {label} <span style={{ opacity: 0.5 }}>(minutes)</span>
                </label>
                <input type="number" min={1} value={settings[key]}
                  onChange={e => set(key, Number(e.target.value))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = accent}
                  onBlur={e => e.target.style.borderColor = T.border} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Display */}
      <div style={card}>
        <div style={cardHead}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, boxShadow: `0 0 8px ${T.green}`, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: T.textDim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Display</span>
        </div>
        <div style={cardBody}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 13, color: T.textMid, fontWeight: 500 }}>Show skipped row count</p>
              <p style={{ fontSize: 11, color: T.textDim, marginTop: 3 }}>Non-sev1/sev2 rows silently skipped during processing</p>
            </div>
            <button onClick={() => set('showSkippedCount', !settings.showSkippedCount)}
              style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0, background: settings.showSkippedCount ? T.amber : T.border2 }}>
              <span style={{ position: 'absolute', top: 3, left: settings.showSkippedCount ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
        <button onClick={handleSave} disabled={saveStatus === 'saving'}
          style={{
            padding: '9px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
            background: saveStatus === 'saved' ? T.green : saveStatus === 'error' ? T.red : T.amber,
            color: T.id === 'dark' ? '#1c1714' : '#fff',
            transition: 'all 0.2s', opacity: saveStatus === 'saving' ? 0.7 : 1,
          }}>
          {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? '✓ Saved' : saveStatus === 'error' ? 'Error — retry' : 'Save Settings'}
        </button>
        <p style={{ fontSize: 11, color: T.textDim }}>Applied to the KPI engine immediately.</p>
      </div>
    </div>
  )
}
