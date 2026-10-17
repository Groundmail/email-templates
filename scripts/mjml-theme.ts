import { headCss } from '../components/styles'
import { theme } from '../theme'

const l = theme.colors.light
const r = theme.radius
const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const NOTE = 'Generated from theme.ts by `npm run build`. Edit theme.ts, not this block.'

/**
 * Generated regions of each .mjml file. The build rewrites the text between the
 * markers, so every MJML file stays standalone (copy one and it compiles) while
 * theme.ts stays the single place to restyle.
 */
export function mjmlRegions(): Record<'theme' | 'header' | 'footer', string> {
  const { brand, font } = theme
  const themeBlock = `<!-- ${NOTE} -->
    <mj-raw>
      <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" />
    </mj-raw>
    <mj-attributes>
      <mj-all font-family="${esc(font.sans)}" />
      <mj-body background-color="${l.page}" width="560px" />
      <mj-wrapper padding="40px 16px" />
      <mj-section padding="0" />
      <mj-column padding="0" />
      <mj-text padding="0 0 16px" font-size="15px" line-height="24px" color="${l.text}" css-class="em-text" />
      <mj-button align="left" background-color="${l.accent}" color="${l.accentText}" font-size="15px" font-weight="600" line-height="20px" border-radius="${r}px" inner-padding="12px 22px" padding="8px 0 24px" css-class="em-button" />
      <mj-divider border-width="1px" border-color="${l.border}" padding="12px 0 28px" css-class="em-rule" />
      <mj-table padding="0 0 24px" font-size="14px" line-height="20px" color="${l.text}" />
      <mj-class name="card" background-color="${l.card}" border="1px solid ${l.border}" border-radius="${r + 4}px" padding="40px" css-class="em-card" />
      <mj-class name="h1" font-size="24px" line-height="32px" font-weight="650" letter-spacing="-0.3px" css-class="em-text em-h1" />
      <mj-class name="small" font-size="13px" line-height="20px" color="${l.muted}" padding="0 0 12px" css-class="em-muted" />
      <mj-class name="danger" background-color="${l.danger}" css-class="em-button-danger" />
      <mj-class name="footer" font-size="12px" line-height="18px" color="${l.muted}" align="center" padding="0 0 6px" css-class="em-muted" />
    </mj-attributes>
    <mj-style inline="inline">
      .em-label { padding: 10px 0; color: ${l.muted}; width: 45%; vertical-align: top; }
      .em-value { padding: 10px 0; color: ${l.text}; text-align: right; vertical-align: top; }
      .em-row-border { border-top: 1px solid ${l.border}; }
      .em-total { padding: 12px 0 10px; color: ${l.text}; font-weight: 650; border-top: 2px solid ${l.text}; vertical-align: top; }
      .em-total-value { padding: 12px 0 10px; color: ${l.text}; font-weight: 650; border-top: 2px solid ${l.text}; text-align: right; vertical-align: top; }
      .em-codebox { margin: 8px 0 8px; padding: 18px 12px; background-color: ${l.subtle}; border: 1px solid ${l.border}; border-radius: ${r}px; text-align: center; font-family: ${font.mono}; font-size: 32px; line-height: 40px; font-weight: 700; letter-spacing: 8px; color: ${l.text}; }
      .em-callout { padding: 14px 16px; background-color: ${l.subtle}; border: 1px solid ${l.border}; border-radius: ${r}px; font-size: 14px; line-height: 22px; color: ${l.text}; }
      .em-track { height: 8px; font-size: 1px; line-height: 8px; border-radius: 999px; background-color: ${l.subtle}; }
      .em-fill { height: 8px; font-size: 1px; line-height: 8px; border-radius: 999px; background-color: ${l.accent}; }
      .em-link { color: ${l.accent}; text-decoration: underline; }
      .em-step { color: ${l.muted}; }
    </mj-style>
    <mj-style>
      body { -webkit-font-smoothing: antialiased; }
      ${headCss({ mjml: true }).split('\n').join('\n      ')}
    </mj-style>
    `

  const logo = brand.logoUrl
    ? `<mj-image src="${esc(brand.logoUrl)}" alt="${esc(brand.name)}" href="${esc(brand.websiteUrl)}" height="${brand.logoHeight}px" width="${brand.logoHeight * 5}px" align="left" padding="0" css-class="em-logo-light" />` +
      (brand.logoUrlDark
        ? `\n          <mj-raw><!--[if !mso]><!--><div class="em-logo-dark" style="display:none;"><a href="${esc(brand.websiteUrl)}"><img src="${esc(brand.logoUrlDark)}" alt="${esc(brand.name)}" height="${brand.logoHeight}" style="height:${brand.logoHeight}px;border:0;" /></a></div><!--<![endif]--></mj-raw>`
        : '')
    : `<mj-text padding="0" font-size="18px" line-height="28px" font-weight="700" letter-spacing="-0.2px" css-class="em-wordmark"><a href="${esc(brand.websiteUrl)}" style="color:${l.text};text-decoration:none;">${esc(brand.name)}</a></mj-text>`

  const header = `<!-- ${NOTE} -->
    <mj-wrapper css-class="em-page">
      <mj-section padding="0 8px 24px">
        <mj-column>
          ${logo}
        </mj-column>
      </mj-section>
      `

  const footer = `<!-- ${NOTE} -->
      ${
        brand.address
          ? `<mj-section padding="0 8px">
        <mj-column>
          <mj-text mj-class="footer">${esc(brand.address)}</mj-text>
        </mj-column>
      </mj-section>
      `
          : ''
      }</mj-wrapper>
    `
  return { theme: themeBlock, header, footer }
}

/** Rewrite the generated regions of an MJML source. */
export function applyMjmlRegions(source: string): string {
  const regions = mjmlRegions()
  let out = source
  for (const [name, body] of Object.entries(regions)) {
    const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`)
    if (!re.test(out)) throw new Error(`missing <!-- ${name}:start --> / <!-- ${name}:end --> markers`)
    out = out.replace(re, (_, start: string, end: string) => `${start}\n    ${body}${end}`)
  }
  return out
}
