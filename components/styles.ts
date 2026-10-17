import { theme } from '../theme'

const light = theme.colors.light
const dark = theme.colors.dark

/**
 * Head CSS shared by the React Email and MJML versions.
 *
 * Light colors are always inline, so clients that drop <style> (some Gmail
 * views, older Outlook) still get a finished light design. Clients that honour
 * prefers-color-scheme get the dark palette; Outlook.com gets it through its
 * [data-ogsc]/[data-ogsb] attributes. Gmail never applies author dark styles
 * and inverts colors itself, which these palettes are chosen to survive.
 */
export function headCss({ mjml = false }: { mjml?: boolean } = {}): string {
  // MJML wraps sections in div > table > td, and puts the page color on <body>.
  const page = mjml ? 'body, .em-page' : '.em-page, .em-page > table > tbody > tr > td'
  const card = mjml ? '.em-card, .em-card > table, .em-card > table > tbody > tr > td' : '.em-card'
  const darkRules = (scope: string) => {
    const sel = (list: string) =>
      list
        .split(',')
        .map((part) => `${scope} ${part.trim()}`.trim())
        .join(', ')
    return [
      `${sel(page)} { background-color: ${dark.page} !important; }`,
      `${sel(card)} { background-color: ${dark.card} !important; border-color: ${dark.border} !important; }`,
      `${sel('.em-text, .em-text > div')} { color: ${dark.text} !important; }`,
      `${sel('.em-muted, .em-muted > div, .em-muted a')} { color: ${dark.muted} !important; }`,
      `${sel('.em-link, .em-text a')} { color: ${dark.accent} !important; }`,
      `${sel('.em-wordmark, .em-wordmark > div, .em-wordmark a')} { color: ${dark.text} !important; }`,
      `${sel('.em-subtle')} { background-color: ${dark.subtle} !important; border-color: ${dark.border} !important; }`,
      `${sel('.em-border')} { border-color: ${dark.border} !important; }`,
      `${sel('.em-strong-border')} { border-color: ${dark.text} !important; }`,
      `${sel('.em-rule, .em-rule p')} { border-top-color: ${dark.border} !important; }`,
      `${sel('.em-track')} { background-color: ${dark.subtle} !important; }`,
      `${sel('.em-fill')} { background-color: ${dark.accent} !important; }`,
      `${sel('a.em-button, .em-button a, .em-button td[bgcolor]')} { background-color: ${dark.accent} !important; color: ${dark.accentText} !important; border-color: ${dark.accent} !important; }`,
      `${sel('a.em-button-danger, .em-button-danger a, .em-button-danger td[bgcolor]')} { background-color: ${dark.danger} !important; color: ${dark.accentText} !important; border-color: ${dark.danger} !important; }`,
    ]
  }
  // Outlook.com marks the colors it rewrote: [data-ogsc] for text, [data-ogsb] for backgrounds.
  const only = (rules: string[], keep: 'color' | 'background') =>
    rules
      .map((rule) =>
        keep === 'color'
          ? rule.replace(/background-color: [^;]+ !important; ?/g, '')
          : rule.replace(/(?<![-\w])color: [^;]+ !important; ?/g, ''),
      )
      .filter((rule) => !/\{\s*\}$/.test(rule))
  const mobile = mjml ? '.em-card > table > tbody > tr > td' : '.em-card-body > tbody > tr > td'
  return [
    ':root { color-scheme: light dark; supported-color-schemes: light dark; }',
    '.em-logo-dark { display: none; }',
    '@media (prefers-color-scheme: dark) {',
    ...darkRules(''),
    '.em-logo-light { display: none !important; }',
    '.em-logo-dark { display: block !important; }',
    '}',
    ...only(darkRules('[data-ogsc]'), 'color'),
    ...only(darkRules('[data-ogsb]'), 'background'),
    '@media only screen and (max-width: 600px) {',
    `${mobile} { padding: 32px 24px !important; }`,
    '.em-h1, .em-h1 > div { font-size: 22px !important; line-height: 30px !important; }',
    '}',
  ].join('\n')
}

/** Inline styles, so every client gets the light design even without <style>. */
export const s = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: light.page,
    fontFamily: theme.font.sans,
    WebkitFontSmoothing: 'antialiased',
  },
  container: { maxWidth: '560px', width: '100%', margin: '0 auto', padding: '40px 16px' },
  header: { padding: '0 8px 24px' },
  wordmark: {
    margin: 0,
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: 700,
    letterSpacing: '-0.2px',
    color: light.text,
  },
  card: {
    backgroundColor: light.card,
    border: `1px solid ${light.border}`,
    borderRadius: `${theme.radius + 4}px`,
  },
  cardBody: { padding: '40px 40px' },
  h1: {
    margin: '0 0 16px',
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 650,
    letterSpacing: '-0.3px',
    color: light.text,
  },
  p: { margin: '0 0 16px', fontSize: '15px', lineHeight: '24px', color: light.text },
  small: { margin: '0 0 12px', fontSize: '13px', lineHeight: '20px', color: light.muted },
  link: { color: light.accent, textDecoration: 'underline' },
  button: {
    display: 'inline-block',
    backgroundColor: light.accent,
    color: light.accentText,
    fontSize: '15px',
    fontWeight: 600,
    lineHeight: '20px',
    textDecoration: 'none',
    borderRadius: `${theme.radius}px`,
    padding: '12px 22px',
  },
  hr: { border: 'none', borderTop: `1px solid ${light.border}`, margin: '28px 0' },
  code: {
    margin: '8px 0 24px',
    padding: '18px 12px',
    backgroundColor: light.subtle,
    border: `1px solid ${light.border}`,
    borderRadius: `${theme.radius}px`,
    textAlign: 'center' as const,
    fontFamily: theme.font.mono,
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: 700,
    letterSpacing: '8px',
    color: light.text,
  },
  callout: {
    margin: '0 0 24px',
    padding: '14px 16px',
    backgroundColor: light.subtle,
    border: `1px solid ${light.border}`,
    borderRadius: `${theme.radius}px`,
  },
  footer: { padding: '24px 8px 0', textAlign: 'center' as const },
  footerText: { margin: '0 0 6px', fontSize: '12px', lineHeight: '18px', color: light.muted },
} as const
