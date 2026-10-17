import fs from 'node:fs'
import mjml2html from 'mjml'
import { doIUseEmail } from 'doiuse-email'
import { beforeAll, describe, expect, it } from 'vitest'
import { SLUGS, loadTemplate, placeholderProps, renderHtml, variablesIn, type TemplateModule } from '../scripts/registry'

const GMAIL_CLIP_BYTES = 102 * 1024

/**
 * Features caniemail lists as unsupported somewhere, that these templates use on
 * purpose as progressive enhancement. The light design never depends on them:
 * - selectors, @media, !important: dark mode and small-screen padding only
 * - display:none, opacity, overflow: hiding the preheader and the dark logo
 * - border-radius: Outlook for Windows shows square corners
 * - <body>, role, aria-label, target, word-break, outline, table-layout: harmless where ignored
 * Anything new (flexbox, grid, CSS variables, background images, web fonts...) fails this test.
 */
const ALLOWED_UNSUPPORTED = new Set([
  'display:none',
  'Class selector',
  'ID selector',
  'Attribute selector',
  'Descendant combinator',
  'Child combinator',
  'Chaining selectors',
  'Type selector',
  '@media',
  '<body> element',
  'overflow',
  'opacity',
  'role attribute',
  'aria-label attribute',
  'target attribute',
  'border-radius',
  'word-break',
  'outline',
  'table-layout',
])
const CLIENTS = ['gmail.*', 'outlook.*', 'apple-mail.*', 'yahoo.*', 'samsung-email.*'] as const

type Built = { slug: string; mod: TemplateModule; html: string; text: string; mjml: string; mjmlHtml: string }
const built: Built[] = []

beforeAll(async () => {
  for (const slug of SLUGS) {
    const mod = await loadTemplate(slug)
    const props = placeholderProps(mod)
    const mjml = fs.readFileSync(`templates/${slug}/${slug}.mjml`, 'utf8')
    const compiled = await mjml2html(mjml, { validationLevel: 'strict' })
    expect(compiled.errors, `${slug}.mjml`).toEqual([])
    built.push({ slug, mod, html: await renderHtml(mod, props), text: mod.text(props), mjml, mjmlHtml: compiled.html })
  }
}, 60_000)

describe.each(SLUGS)('%s', (slug) => {
  const get = () => built.find((b) => b.slug === slug)!

  it('ships every format', () => {
    for (const ext of ['tsx', 'mjml', 'html', 'txt']) {
      expect(fs.existsSync(`templates/${slug}/${slug}.${ext}`), ext).toBe(true)
    }
    expect(fs.existsSync(`templates/${slug}/groundmail.json`)).toBe(true)
  })

  it('has the same variables in React Email, MJML and text', () => {
    const { html, mjmlHtml, text, mod } = get()
    const react = variablesIn(html).sort()
    expect(variablesIn(mjmlHtml).sort()).toEqual(react)
    // Every variable is used in HTML, and the text version carries every link.
    expect(react.length).toBeGreaterThan(0)
    for (const name of react.filter((v) => v.endsWith('_url'))) expect(text).toContain(`{{${name}}}`)
    for (const name of variablesIn(mod.meta.subject)) expect(react).toContain(name)
  })

  it('renders sample props without leaks', async () => {
    const { mod } = get()
    const html = await renderHtml(mod, mod.default.PreviewProps)
    expect(html).not.toMatch(/\{\{|undefined|\[object Object\]|NaN/)
    expect(mod.text(mod.default.PreviewProps)).not.toMatch(/\{\{|undefined|\[object Object\]|<\/?[a-z]/)
  })

  it('stays under the Gmail clipping limit', () => {
    const { html, mjmlHtml } = get()
    expect(Buffer.byteLength(html)).toBeLessThan(GMAIL_CLIP_BYTES)
    expect(Buffer.byteLength(mjmlHtml)).toBeLessThan(GMAIL_CLIP_BYTES)
  })

  it('supports dark mode and keeps the light design inline', () => {
    for (const html of [get().html, get().mjmlHtml]) {
      expect(html).toContain('name="color-scheme" content="light dark"')
      expect(html).toMatch(/@media \(prefers-color-scheme: dark\)/)
      expect(html).toContain('[data-ogsc]')
      // With every <style> stripped (some Gmail and Outlook views), colors still come from inline styles.
      const bare = html.replace(/<style[\s\S]*?<\/style>/g, '')
      expect(bare).toMatch(/background(-color)?:\s?#ffffff/i)
      expect(bare).toMatch(/color:\s?#18181b/i)
    }
  })

  it('uses only email-safe features (caniemail)', () => {
    for (const html of [get().html, get().mjmlHtml]) {
      const result = doIUseEmail(html, { emailClients: [...CLIENTS] })
      const unexpected = [
        ...new Set(
          ('errors' in result ? result.errors : [])
            .map((e: string) => /^`(.+?)` is not supported/.exec(e)?.[1] ?? e)
            .filter((feature: string) => !ALLOWED_UNSUPPORTED.has(feature)),
        ),
      ]
      expect(unexpected).toEqual([])
    }
  })

  it('has no web fonts, scripts or remote CSS', () => {
    for (const html of [get().html, get().mjmlHtml]) {
      expect(html).not.toMatch(/<script|<link|@import|@font-face/i)
    }
  })

  it('is brand-neutral', () => {
    const { html, text, mjml } = get()
    for (const source of [html, text, mjml]) expect(source.toLowerCase()).not.toContain('groundmail')
  })

  it('stores a valid templates API payload', () => {
    const payload = JSON.parse(fs.readFileSync(`templates/${slug}/groundmail.json`, 'utf8'))
    expect(payload).toMatchObject({ alias: slug, format: 'html', category: 'transactional' })
    expect(payload.name).toBe(get().mod.meta.name)
    expect(payload.subject).toBe(get().mod.meta.subject)
    expect(payload.html).toBe(fs.readFileSync(`templates/${slug}/${slug}.html`, 'utf8'))
    expect(payload.text).toBe(fs.readFileSync(`templates/${slug}/${slug}.txt`, 'utf8'))
  })
})
