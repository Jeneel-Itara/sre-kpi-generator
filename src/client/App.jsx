import { useState, createContext, useContext } from 'react'
import { DARK, LIGHT, getInitialTheme, saveTheme } from './theme.js'
import { loadHistory, saveToHistory, deleteFromHistory } from './history.js'
import UploadBox from './components/UploadBox.jsx'
import KpiTable from './components/KpiTable.jsx'
import FilterBar from './components/FilterBar.jsx'
import ValidationReport from './components/ValidationReport.jsx'
import SettingsPage from './components/SettingsPage.jsx'
import ReportHeader from './components/ReportHeader.jsx'
import HistoryPanel from './components/HistoryPanel.jsx'
import { uploadFile } from './services/api.js'

export const ThemeCtx = createContext(DARK)
export const useTheme = () => useContext(ThemeCtx)

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: <svg viewBox="0 0 20 20" fill="currentColor" style={{width:16,height:16}}><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>,
  history:   <svg viewBox="0 0 20 20" fill="currentColor" style={{width:16,height:16}}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd"/></svg>,
  settings:  <svg viewBox="0 0 20 20" fill="currentColor" style={{width:16,height:16}}><path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>,
  sun:  <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14}}><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zm0 13a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zm8-5a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM3.75 10a.75.75 0 01-.75.75H1.5a.75.75 0 010-1.5H3a.75.75 0 01.75.75zm12.02-4.23a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm-9.19 9.19a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm9.19 1.06a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 111.06-1.06l1.06 1.06a.75.75 0 010 1.06zM4.56 5.83a.75.75 0 010-1.06l1.06-1.06a.75.75 0 011.06 1.06L5.62 5.83a.75.75 0 01-1.06 0zM10 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"/></svg>,
  moon: <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14}}><path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clipRule="evenodd"/></svg>,
}

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { id: 'history',   label: 'History',   icon: Icons.history   },
  { id: 'settings',  label: 'Settings',  icon: Icons.settings  },
]

// ── Theme toggle ──────────────────────────────────────────────────────────────
function ThemeToggle({ theme, onToggle }) {
  const T = theme
  const isDark = T.id === 'dark'
  return (
    <button onClick={onToggle} title={isDark ? 'Light mode' : 'Dark mode'}
      style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 10px', borderRadius:8, border:`1px solid ${T.border2}`, background:T.surface3, cursor:'pointer', color:T.textMid, fontSize:11, fontWeight:500, transition:'all 0.2s' }}>
      {isDark ? Icons.sun : Icons.moon}
      {isDark ? 'Light' : 'Dark'}
    </button>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, variant = 'neutral' }) {
  const T = useTheme()
  const v = { neutral: T.statNeutral, amber: T.statAmber, green: T.statGreen, red: T.statRed }[variant]
  const valColor = { neutral: T.text, amber: T.amber, green: T.green, red: T.red }[variant]

  return (
    <div style={{ background: v.bg, border: `1px solid ${v.border}`, borderRadius: 10, padding: '18px 20px' }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: T.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color: valColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: T.textDim, marginTop: 8, lineHeight: 1.4 }}>{sub}</p>}
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  const T = useTheme()
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 0', userSelect:'none', textAlign:'center' }}>
      <div style={{ width:56, height:56, borderRadius:14, background:T.surface2, border:`1px solid ${T.border2}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
        <svg style={{ width:26, height:26, color:T.textDim }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <p style={{ fontSize:15, fontWeight:600, color:T.textMid, marginBottom:8 }}>No report yet</p>
      <p style={{ fontSize:13, color:T.textDim, maxWidth:260, lineHeight:1.6 }}>
        Fill in the report details above, then drop your shift Excel file to generate KPI tables.
      </p>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme]         = useState(getInitialTheme)
  const [page, setPage]           = useState('dashboard')
  const [status, setStatus]       = useState('idle')
  const [error, setError]         = useState(null)
  const [overall, setOverall]     = useState([])
  const [customer, setCustomer]   = useState([])
  const [rejected, setRejected]   = useState([])
  const [meta, setMeta]           = useState(null)
  const [filters, setFilters]     = useState({ shift: '', date_from: '', date_to: '' })
  const [history, setHistory]     = useState(loadHistory)
  const [reportInfo, setReportInfo] = useState({ shiftName: '', engineer: '', date: new Date().toISOString().slice(0, 10) })

  const T = theme

  function toggleTheme() {
    const next = T.id === 'dark' ? LIGHT : DARK
    setTheme(next)
    saveTheme(next)
  }

  async function handleUpload(file) {
    setStatus('loading'); setError(null); setRejected([]); setMeta(null)
    try {
      const data = await uploadFile(file, filters)
      setOverall(data.overall_table)
      setCustomer(data.customer_table)
      setRejected(data.rejected_rows || [])
      setMeta(data.meta || null)
      setStatus('success')

      // Save to history
      const entry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        fileName: file.name,
        reportInfo: { ...reportInfo },
        filters: { ...filters },
        overall_table: data.overall_table,
        customer_table: data.customer_table,
        meta: data.meta,
      }
      setHistory(saveToHistory(entry))
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
      setStatus('error')
    }
  }

  function loadFromHistory(entry) {
    setOverall(entry.overall_table)
    setCustomer(entry.customer_table)
    setMeta(entry.meta)
    setReportInfo(entry.reportInfo || { shiftName: '', engineer: '', date: '' })
    setFilters(entry.filters || { shift: '', date_from: '', date_to: '' })
    setRejected([])
    setStatus('success')
    setPage('dashboard')
  }

  function handleDeleteHistory(id) {
    setHistory(deleteFromHistory(id))
  }

  const totalIncidents = overall.reduce((s, r) => s + (r['Total Incidents'] !== '--' ? Number(r['Total Incidents']) : 0), 0)
  const teams          = [...new Set(customer.map(r => r.Team))].length
  const sev2Row        = overall.find(r => r.Severity === 'Severity 2')

  return (
    <ThemeCtx.Provider value={T}>
      <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:T.bg, color:T.text }}>

        {/* ── Sidebar ── */}
        <aside style={{ width:220, flexShrink:0, display:'flex', flexDirection:'column', background:T.surface, borderRight:`1px solid ${T.border}` }}>

          {/* Logo */}
          <div style={{ padding:'24px 20px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:T.logoGrad, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:T.logoShadow }}>
                <svg style={{ width:17, height:17, color:'#fff' }} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:T.text, lineHeight:1, letterSpacing:'-0.02em' }}>SRE KPI</p>
                <p style={{ fontSize:10, color:T.textDim, lineHeight:1, marginTop:4, letterSpacing:'0.06em' }}>Generator</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex:1, padding:'4px 10px', display:'flex', flexDirection:'column', gap:1 }}>
            {NAV.map(({ id, label, icon }) => {
              const active = page === id
              return (
                <button key={id} onClick={() => setPage(id)}
                  style={{
                    position:'relative', width:'100%', display:'flex', alignItems:'center', gap:10,
                    padding:'9px 12px', borderRadius:8, fontSize:13.5, fontWeight: active ? 500 : 400,
                    cursor:'pointer', border:'none', textAlign:'left', transition:'all 0.12s',
                    background: active ? T.navActiveBg : 'transparent',
                    color: active ? T.amber : T.textMid,
                  }}>
                  {active && <span style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:3, height:16, background:T.amber, borderRadius:'0 2px 2px 0' }} />}
                  <span style={{ color: active ? T.amber : T.textDim, flexShrink:0 }}>{icon}</span>
                  {label}
                  {id === 'history' && history.length > 0 && (
                    <span style={{ marginLeft:'auto', fontSize:10, fontWeight:600, color:T.textDim, background:T.surface3, borderRadius:10, padding:'1px 6px' }}>
                      {history.length}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div style={{ padding:'14px 20px', borderTop:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:T.green, boxShadow:`0 0 5px ${T.green}`, flexShrink:0 }} />
              <span style={{ fontSize:11, color:T.textDim }}>v2.0</span>
            </div>
            <ThemeToggle theme={T} onToggle={toggleTheme} />
          </div>
        </aside>

        {/* ── Main ── */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

          {/* Topbar */}
          <header style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:56, borderBottom:`1px solid ${T.border}`, background:T.surface }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <h1 style={{ fontSize:14, fontWeight:600, color:T.text, letterSpacing:'-0.01em' }}>
                {{ dashboard:'Shift KPI Report', history:'Report History', settings:'Settings' }[page]}
              </h1>
              {page === 'dashboard' && status === 'success' && meta && (
                <span style={{ fontSize:11, color:T.textDim, background:T.surface2, border:`1px solid ${T.border}`, borderRadius:20, padding:'2px 10px', fontVariantNumeric:'tabular-nums' }}>
                  {meta.total_rows} rows · {meta.valid_rows} processed{meta.skipped_count > 0 ? ` · ${meta.skipped_count} skipped` : ''}
                </span>
              )}
            </div>
            {page === 'dashboard' && status === 'success' && (
              <button onClick={() => { setStatus('idle'); setOverall([]); setCustomer([]); setRejected([]); setMeta(null) }}
                style={{ fontSize:12, color:T.textDim, background:'none', border:`1px solid ${T.border}`, borderRadius:7, padding:'5px 12px', cursor:'pointer' }}>
                New report
              </button>
            )}
          </header>

          {/* Body */}
          <main style={{ flex:1, overflowY:'auto', padding:'32px', background:T.bg }}>

            {page === 'settings' && <SettingsPage />}
            {page === 'history'  && <HistoryPanel history={history} onLoad={loadFromHistory} onDelete={handleDeleteHistory} />}

            {page === 'dashboard' && (
              <div style={{ maxWidth:1000, margin:'0 auto' }}>

                {/* Error */}
                {status === 'error' && error && (
                  <div style={{ marginBottom:20, display:'flex', alignItems:'flex-start', justifyContent:'space-between', background:T.redBg, border:`1px solid ${T.redBorder}`, borderRadius:10, padding:'12px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <svg style={{ width:15, height:15, color:T.red, flexShrink:0 }} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                      </svg>
                      <span style={{ fontSize:13, color:T.red }}>{error}</span>
                    </div>
                    <button onClick={() => setStatus('idle')} style={{ color:T.textDim, background:'none', border:'none', cursor:'pointer', fontSize:18, lineHeight:1, marginLeft:12 }}>×</button>
                  </div>
                )}

                {rejected.length > 0 && <ValidationReport rejectedRows={rejected} />}

                {/* Upload section */}
                {(status === 'idle' || status === 'error') && (
                  <div style={{ marginBottom:32 }}>
                    <ReportHeader info={reportInfo} onChange={setReportInfo} />
                    <div style={{ marginTop:16 }}>
                      <FilterBar filters={filters} onChange={setFilters} />
                      <UploadBox onUpload={handleUpload} disabled={false} />
                    </div>
                  </div>
                )}

                {/* Loading */}
                {status === 'loading' && (
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 0', gap:16 }}>
                    <div style={{ position:'relative', width:40, height:40 }}>
                      <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:`3px solid ${T.border2}` }} />
                      <div className="animate-spin" style={{ position:'absolute', inset:0, borderRadius:'50%', border:'3px solid transparent', borderTopColor:T.amber }} />
                    </div>
                    <p style={{ fontSize:13, color:T.textDim }}>Processing…</p>
                  </div>
                )}

                {/* Results */}
                {status === 'success' && overall.length > 0 && (
                  <div>
                    {/* Report header summary */}
                    {(reportInfo.shiftName || reportInfo.engineer || reportInfo.date) && (
                      <div style={{ marginBottom:24, padding:'14px 20px', background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
                        {reportInfo.shiftName && <div><p style={{ fontSize:10, color:T.textDim, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>Shift</p><p style={{ fontSize:14, fontWeight:600, color:T.text }}>{reportInfo.shiftName}</p></div>}
                        {reportInfo.date && <div><p style={{ fontSize:10, color:T.textDim, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>Date</p><p style={{ fontSize:14, fontWeight:600, color:T.text }}>{reportInfo.date}</p></div>}
                        {reportInfo.engineer && <div><p style={{ fontSize:10, color:T.textDim, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>Engineer</p><p style={{ fontSize:14, fontWeight:600, color:T.text }}>{reportInfo.engineer}</p></div>}
                        {filters.shift && <div><p style={{ fontSize:10, color:T.textDim, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>Filter</p><p style={{ fontSize:14, fontWeight:600, color:T.text, textTransform:'capitalize' }}>{filters.shift} shift</p></div>}
                      </div>
                    )}

                    {/* Stat cards */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:28 }}>
                      <StatCard label="Total Incidents" value={totalIncidents} sub="sev1 + sev2" variant="amber" />
                      <StatCard label="Teams" value={teams} sub="with tracked alerts" variant="neutral" />
                      <StatCard label="Avg MTTR · Sev2" value={sev2Row?.MTTR !== '--' ? sev2Row?.MTTR : '—'} sub="hh:mm:ss" variant={sev2Row?.MTTR !== '--' ? 'green' : 'neutral'} />
                    </div>

                    <KpiTable title="Overall Shift KPIs"      data={overall}  filename="overall-kpi"  accent="amber" />
                    <KpiTable title="Customer-wise Shift KPI" data={customer} filename="customer-kpi" accent="sage"  />
                  </div>
                )}

                {status === 'idle' && <EmptyState />}

                {/* File had no sev1/sev2 rows */}
                {status === 'success' && overall.length === 0 && (
                  <div style={{ textAlign:'center', padding:'60px 0' }}>
                    <div style={{ width:52, height:52, borderRadius:12, background:T.surface2, border:`1px solid ${T.border2}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                      <svg style={{ width:24, height:24, color:T.amber }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <p style={{ fontSize:15, fontWeight:600, color:T.textMid, marginBottom:8 }}>No tracked incidents found</p>
                    <p style={{ fontSize:13, color:T.textDim, maxWidth:320, margin:'0 auto', lineHeight:1.6 }}>
                      This file has no Severity 1 or Severity 2 incidents. All {meta?.total_rows || ''} rows were skipped — check that the Severity column contains <code style={{ background:T.surface2, padding:'1px 5px', borderRadius:4, fontSize:12 }}>sev1</code> or <code style={{ background:T.surface2, padding:'1px 5px', borderRadius:4, fontSize:12 }}>sev2</code> values.
                    </p>
                    <button onClick={() => setStatus('idle')} style={{ marginTop:20, fontSize:12, color:T.amber, background:T.amberBg, border:`1px solid ${T.amberBorder}`, borderRadius:8, padding:'7px 16px', cursor:'pointer' }}>
                      Upload a different file
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </ThemeCtx.Provider>
  )
}
