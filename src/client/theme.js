/**
 * theme.js
 *
 * Dark  → Notion/Obsidian style: cool neutral greys, generous whitespace,
 *          calm and readable. Accent: warm amber for interactive elements.
 *
 * Light → Warm cream/beige/white. Same amber accent.
 */

export const DARK = {
  id: 'dark',

  // Page & surfaces — cool neutral, not brown
  bg:       '#191919',   // Notion dark page bg
  surface:  '#202020',   // sidebar / card bg
  surface2: '#252525',   // slightly elevated
  surface3: '#2e2e2e',   // hover state
  surface4: '#383838',   // active / selected

  // Borders — very subtle
  border:   '#2e2e2e',
  border2:  '#383838',

  // Text — Notion-style hierarchy
  text:     '#e8e8e8',   // primary
  textMid:  '#9b9b9b',   // secondary
  textDim:  '#555555',   // tertiary / placeholder

  // Accent — warm amber (the only warm element)
  amber:       '#e8a020',
  amberLight:  '#f0b840',
  amberBg:     'rgba(232,160,32,0.08)',
  amberBorder: 'rgba(232,160,32,0.18)',

  // Second accent — sage (for customer table)
  sage:        '#7a9e7e',
  sageBg:      'rgba(122,158,126,0.08)',
  sageBorder:  'rgba(122,158,126,0.18)',

  // Semantic
  green:    '#4caf82',
  greenBg:  'rgba(76,175,130,0.08)',
  greenBorder: 'rgba(76,175,130,0.2)',
  red:      '#e05252',
  redBg:    'rgba(224,82,82,0.08)',
  redBorder: 'rgba(224,82,82,0.2)',

  // Stat card tints
  statAmber:  { bg: '#1f1a0f', border: '#3d3010' },
  statGreen:  { bg: '#0f1a14', border: '#1a3828' },
  statRed:    { bg: '#1a0f0f', border: '#3d1818' },
  statNeutral:{ bg: '#202020', border: '#2e2e2e' },

  // Nav
  navActiveBg:  'rgba(232,160,32,0.07)',
  navActiveDot: '#e8a020',

  // Logo
  logoGrad:   'linear-gradient(135deg, #d4920a 0%, #b07208 100%)',
  logoShadow: '0 0 0 1px rgba(232,160,32,0.2), 0 2px 8px rgba(180,114,8,0.35)',

  // Misc
  monoColor: '#c8924a',
  shadow: '0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)',
  shadowLg: '0 4px 24px rgba(0,0,0,0.5)',
}

export const LIGHT = {
  id: 'light',

  // Page & surfaces — warm cream
  bg:       '#faf8f5',
  surface:  '#ffffff',
  surface2: '#f5f1eb',
  surface3: '#ede8df',
  surface4: '#e4ddd2',

  // Borders
  border:   '#e8e2d8',
  border2:  '#d8d0c4',

  // Text
  text:     '#1a1612',
  textMid:  '#6b5f52',
  textDim:  '#b0a494',

  // Accent
  amber:       '#b86800',
  amberLight:  '#d47a00',
  amberBg:     'rgba(184,104,0,0.07)',
  amberBorder: 'rgba(184,104,0,0.18)',

  // Second accent
  sage:        '#4a7a50',
  sageBg:      'rgba(74,122,80,0.07)',
  sageBorder:  'rgba(74,122,80,0.18)',

  // Semantic
  green:    '#1a7a4a',
  greenBg:  'rgba(26,122,74,0.07)',
  greenBorder: 'rgba(26,122,74,0.18)',
  red:      '#b03030',
  redBg:    'rgba(176,48,48,0.07)',
  redBorder: 'rgba(176,48,48,0.18)',

  // Stat card tints
  statAmber:  { bg: '#fff8ec', border: '#f0d898' },
  statGreen:  { bg: '#f0faf5', border: '#9ed8b8' },
  statRed:    { bg: '#fff2f2', border: '#f0b8b8' },
  statNeutral:{ bg: '#ffffff', border: '#e8e2d8' },

  // Nav
  navActiveBg:  'rgba(184,104,0,0.07)',
  navActiveDot: '#b86800',

  // Logo
  logoGrad:   'linear-gradient(135deg, #c87d1a 0%, #a05e10 100%)',
  logoShadow: '0 0 0 1px rgba(184,104,0,0.15), 0 2px 8px rgba(160,94,16,0.2)',

  // Misc
  monoColor: '#8a5a20',
  shadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
  shadowLg: '0 4px 24px rgba(0,0,0,0.1)',
}

export function getInitialTheme() {
  try {
    const saved = localStorage.getItem('kpi_theme')
    if (saved === 'light') return LIGHT
    if (saved === 'dark')  return DARK
  } catch {}
  return DARK
}

export function saveTheme(theme) {
  try { localStorage.setItem('kpi_theme', theme.id) } catch {}
}
