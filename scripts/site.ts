import fs from 'node:fs'
import path from 'node:path'
import type { BuiltTemplate } from './build'

const SITE_SRC = path.resolve(import.meta.dirname, '..', 'site')

/** Static preview site: one shell page, plus per-template JSON and preview pages it loads on demand. */
export async function buildSite(templates: BuiltTemplate[], outDir: string) {
  fs.rmSync(outDir, { recursive: true, force: true })
  fs.mkdirSync(path.join(outDir, 'data'), { recursive: true })
  fs.mkdirSync(path.join(outDir, 'previews'), { recursive: true })

  const manifest = templates.map(({ slug, name, description, group, subject }) => ({ slug, name, description, group, subject }))
  for (const t of templates) {
    fs.writeFileSync(path.join(outDir, 'data', `${t.slug}.json`), JSON.stringify(t))
    fs.writeFileSync(path.join(outDir, 'previews', `${t.slug}.html`), t.previews.react)
    fs.writeFileSync(path.join(outDir, 'previews', `${t.slug}.mjml.html`), t.previews.mjml)
  }

  const shell = fs
    .readFileSync(path.join(SITE_SRC, 'index.html'), 'utf8')
    .replace('/*__MANIFEST__*/[]', JSON.stringify(manifest).replace(/</g, '\\u003c'))
    .replace(/__COUNT__/g, String(templates.length))
  fs.writeFileSync(path.join(outDir, 'index.html'), shell)
  for (const file of ['app.js', 'style.css']) {
    fs.copyFileSync(path.join(SITE_SRC, file), path.join(outDir, file))
  }
  fs.writeFileSync(path.join(outDir, '.nojekyll'), '')
  console.log(`site → ${path.relative(process.cwd(), outDir)} (${templates.length} templates)`)
}
