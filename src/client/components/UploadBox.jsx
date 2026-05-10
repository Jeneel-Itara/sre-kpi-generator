import { useState, useRef } from 'react'
import { useTheme } from '../App.jsx'

export default function UploadBox({ onUpload, disabled = false }) {
  const T = useTheme()
  const [fileName, setFileName] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  function processFile(file) {
    if (!file || disabled) return
    setFileName(file.name)
    onUpload(file)
  }

  const isDragging = dragging && !disabled

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDrop={e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]) }}
      onDragOver={e => { e.preventDefault(); if (!disabled) setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 20,
        padding: '20px 24px', borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1, userSelect: 'none', transition: 'all 0.2s',
        background: isDragging ? T.amberBg : T.surface,
        border: `2px dashed ${isDragging ? T.amber : fileName ? T.border2 : T.border}`,
        transform: isDragging ? 'scale(1.004)' : 'scale(1)',
      }}>

      <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv"
        onChange={e => processFile(e.target.files[0])} disabled={disabled} style={{ display: 'none' }} />

      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isDragging ? T.amberBg : T.surface2,
        border: `1px solid ${isDragging ? T.amberBorder : T.border}`,
        transition: 'all 0.2s',
      }}>
        {fileName && !isDragging ? (
          <svg style={{ width: 20, height: 20, color: T.green }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg style={{ width: 20, height: 20, color: isDragging ? T.amber : T.textDim }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {fileName ? (
          <>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.amber, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</p>
            <p style={{ fontSize: 11, color: T.textDim, marginTop: 3 }}>Click or drop a new file to replace</p>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13, fontWeight: 600, color: isDragging ? T.amber : T.textMid }}>
              {isDragging ? 'Release to upload' : 'Drop your shift report here'}
            </p>
            <p style={{ fontSize: 11, color: T.textDim, marginTop: 3 }}>
              or <span style={{ color: T.amber }}>click to browse</span> · .xlsx .xls .csv
            </p>
          </>
        )}
      </div>

      {/* Browse badge */}
      {!fileName && !isDragging && (
        <div style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: T.amberBg, border: `1px solid ${T.amberBorder}`, color: T.amber }}>
          Browse
        </div>
      )}
    </div>
  )
}
