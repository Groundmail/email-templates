import { theme } from '../theme'

/**
 * Plain-text bodies. Every template ships one: spam filters score HTML-only
 * mail lower, and some people read mail as text.
 */
export function plainText(...blocks: Array<string | false | null | undefined>): string {
  const { brand } = theme
  const footer = [brand.name, brand.address].filter(Boolean).join('\n')
  return [...blocks.filter(Boolean), '--', footer].join('\n\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}

/** Aligned "Label: value" lines, the text twin of <Details>. */
export function textDetails(rows: Array<[string, string]>): string {
  const width = Math.max(...rows.map(([label]) => label.length)) + 2
  return rows.map(([label, value]) => `${`${label}:`.padEnd(width)}${value}`).join('\n')
}
