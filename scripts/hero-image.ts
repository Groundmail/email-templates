/**
 * Regenerates .github/templates.png, the README hero, with headless Chrome:
 *   CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npx tsx scripts/hero-image.ts
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { loadTemplate, renderHtml } from './registry'

const ROOT = path.resolve(import.meta.dirname, '..')
const chrome = process.env.CHROME ?? 'google-chrome'
const shots: Array<[string, 'light' | 'dark']> = [
  ['password-reset', 'light'],
  ['one-time-code', 'dark'],
  ['receipt', 'light'],
  ['new-sign-in', 'dark'],
]

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
const frames: string[] = []
for (const [slug, scheme] of shots) {
  const mod = await loadTemplate(slug)
  let html = await renderHtml(mod, mod.default.PreviewProps)
  if (scheme === 'dark') html = html.replace(/@media \(prefers-color-scheme: dark\)/g, '@media all')
  frames.push(`<div class="f ${scheme}"><iframe srcdoc="${esc(html)}"></iframe></div>`)
}

const page = `<!doctype html><html><head><style>
html,body{margin:0}
body{width:2480px;height:860px;background:linear-gradient(135deg,#ececef,#dcdce2);display:flex;gap:40px;padding:60px 60px 0;box-sizing:border-box;overflow:hidden}
.f{flex:0 0 560px;height:1000px;border-radius:18px 18px 0 0;overflow:hidden;box-shadow:0 20px 50px rgba(20,20,30,.18)}
.f.dark{background:#0e0e10}.f.light{background:#f4f4f5}
iframe{width:560px;height:1000px;border:0;display:block}
</style></head><body>${frames.join('')}</body></html>`

const tmp = path.join(os.tmpdir(), `hero-${process.pid}.html`)
fs.writeFileSync(tmp, page)
fs.mkdirSync(path.join(ROOT, '.github'), { recursive: true })
execFileSync(chrome, [
  '--headless=new',
  '--hide-scrollbars',
  '--disable-gpu',
  '--force-color-profile=srgb',
  '--window-size=2480,860',
  '--virtual-time-budget=4000',
  `--screenshot=${path.join(ROOT, '.github', 'templates.png')}`,
  `file://${tmp}`,
], { stdio: 'inherit' })
fs.rmSync(tmp)
