/**
 * The one file to edit to make these templates yours.
 *
 * Every format reads from here: the React Email components import it directly,
 * and `npm run build` writes it into the MJML heads and the generated HTML and
 * text files. Change a value, run the build, and all 12 templates follow.
 */
export const theme = {
  brand: {
    /** Shown as a wordmark in the header when there is no logo, and in subjects and footers. */
    name: 'Acme',
    /** Absolute https URL to a PNG logo, about 2x its display size. Leave empty to show the name. */
    logoUrl: '',
    /** Optional logo for dark mode (Apple Mail, Outlook for Mac, iOS Mail). Falls back to logoUrl. */
    logoUrlDark: '',
    /** Display height of the logo in pixels. */
    logoHeight: 28,
    websiteUrl: 'https://example.com',
    /** Mailing address for the footer. Leave empty to hide it. */
    address: 'Acme Inc. · 100 Market Street · San Francisco, CA 94105',
  },
  font: {
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
  },
  /** Corner radius for the card, buttons and code boxes. Outlook for Windows always shows square corners. */
  radius: 8,
  colors: {
    light: {
      page: '#f4f4f5',
      card: '#ffffff',
      text: '#18181b',
      muted: '#52525b',
      border: '#e4e4e7',
      subtle: '#f4f4f5',
      accent: '#2f5bd3',
      accentText: '#ffffff',
      danger: '#b42318',
    },
    dark: {
      page: '#0e0e10',
      card: '#18181b',
      text: '#f4f4f5',
      muted: '#a1a1aa',
      border: '#2e2e33',
      subtle: '#232327',
      accent: '#7a9bff',
      accentText: '#0b0d14',
      danger: '#f97066',
    },
  },
} as const

export type Theme = typeof theme
