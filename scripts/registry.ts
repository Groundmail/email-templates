import * as React from 'react'
import { pretty, render } from 'react-email'
import type { TemplateMeta } from '../components/meta'

/** Display order for the README, preview site and `npm run push -- --all`. */
export const SLUGS = [
  'password-reset',
  'magic-link',
  'email-verification',
  'one-time-code',
  'welcome',
  'team-invite',
  'new-sign-in',
  'account-deletion',
  'receipt',
  'payment-failed',
  'subscription-renewal',
  'usage-alert',
] as const

export type Slug = (typeof SLUGS)[number]

type Props = Record<string, unknown>

export type TemplateModule = {
  default: React.FC<Props> & { PreviewProps: Props }
  meta: TemplateMeta
  text: (props: Props) => string
  placeholders?: Props
}

export async function loadTemplate(slug: string): Promise<TemplateModule> {
  return (await import(`../templates/${slug}/${slug}.tsx`)) as TemplateModule
}

export const toSnake = (key: string) => key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)

/** Props where every string becomes its `{{snake_case}}` placeholder, for the account-ready HTML and text. */
export function placeholderProps(mod: TemplateModule): Props {
  const out: Props = {}
  for (const [key, value] of Object.entries(mod.default.PreviewProps)) {
    out[key] = typeof value === 'string' ? `{{${toSnake(key)}}}` : value
  }
  return { ...out, ...mod.placeholders }
}

/** Sample values keyed by placeholder name, for previews and send snippets. */
export function sampleVariables(mod: TemplateModule): Record<string, string> {
  const vars: Record<string, string> = {}
  const preview = mod.default.PreviewProps
  for (const [key, value] of Object.entries(preview)) {
    if (typeof value === 'string') vars[toSnake(key)] = value
  }
  // Array props (receipt line items) map to the flat placeholders declared in `placeholders`.
  for (const [key, value] of Object.entries(mod.placeholders ?? {})) {
    const sample = preview[key]
    if (!Array.isArray(value) || !Array.isArray(sample)) continue
    const template = value[0] as Record<string, string>
    const first = sample[0] as Record<string, string>
    for (const [field, placeholder] of Object.entries(template)) {
      const name = /\{\{(\w+)\}\}/.exec(placeholder)?.[1]
      if (name) vars[name] = first[field]
    }
  }
  return vars
}

export async function renderHtml(mod: TemplateModule, props: Props): Promise<string> {
  const html = await render(React.createElement(mod.default, props))
  // Drop React's hydration and text-boundary comments; email clients don't need them.
  return pretty(html.replace(/<!--(?:\$|\/\$|html|head|body| )-->/g, ''))
}

export const variablesIn = (...sources: string[]) => [
  ...new Set(sources.flatMap((source) => [...source.matchAll(/\{\{\s*([a-zA-Z_]\w*)\s*\}\}/g)].map((m) => m[1]))),
]

/** Fill `{{variables}}` the way the templates API does: HTML-escaped in HTML. */
export function interpolate(source: string, vars: Record<string, string>, escape: boolean): string {
  const esc = (v: string) =>
    v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  return source.replace(/\{\{\s*([a-zA-Z_]\w*)\s*\}\}/g, (_, key: string) =>
    key in vars ? (escape ? esc(vars[key]) : vars[key]) : '',
  )
}
