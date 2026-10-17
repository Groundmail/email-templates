/**
 * Create or update templates in your Groundmail account, keyed by alias.
 *
 *   GROUNDMAIL_API_KEY=gm_... npm run push -- password-reset welcome
 *   GROUNDMAIL_API_KEY=gm_... npm run push -- --all
 *   add --draft to leave them unpublished
 *
 * Rebuilds first, so edits to theme.ts or a template are always what gets pushed.
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { buildAll } from './build'
import { SLUGS } from './registry'

const ROOT = path.resolve(import.meta.dirname, '..')
const args = process.argv.slice(2)
const all = args.includes('--all')
const draft = args.includes('--draft')
const requested = all ? [...SLUGS] : args.filter((a) => !a.startsWith('--'))

const unknown = requested.filter((slug) => !(SLUGS as readonly string[]).includes(slug))
if (!requested.length || unknown.length) {
  if (unknown.length) console.error(`Unknown template: ${unknown.join(', ')}`)
  console.error(`Usage: npm run push -- <template...> | --all [--draft]\nTemplates: ${SLUGS.join(', ')}`)
  process.exit(1)
}
if (!process.env.GROUNDMAIL_API_KEY) {
  console.error('Set GROUNDMAIL_API_KEY to an API key with the templates:write scope (https://app.groundmail.dev).')
  process.exit(1)
}

const built = await buildAll()
const bin = path.join(ROOT, 'node_modules', '.bin', process.platform === 'win32' ? 'groundmail.cmd' : 'groundmail')
let failed = 0
for (const slug of requested) {
  const t = built.find((b) => b.slug === slug)!
  const dir = path.join('templates', slug)
  const result = spawnSync(
    bin,
    [
      'templates',
      'push',
      path.join(dir, `${slug}.html`),
      '--alias',
      slug,
      '--name',
      t.name,
      '--subject',
      t.subject,
      '--text',
      path.join(dir, `${slug}.txt`),
      ...(draft ? [] : ['--publish']),
      ...(process.env.GROUNDMAIL_BASE_URL ? ['--base-url', process.env.GROUNDMAIL_BASE_URL] : []),
    ],
    { cwd: ROOT, encoding: 'utf8', shell: process.platform === 'win32' },
  )
  if (result.status === 0) {
    const out = JSON.parse(result.stdout.trim().split('\n').pop() || '{}')
    const verb = out.pushed?.created ? 'created' : 'updated'
    console.log(`✓ ${slug} ${verb}${draft ? ' (draft)' : ' and published'}`)
  } else {
    failed += 1
    console.error(`✗ ${slug}: ${(result.stderr || result.stdout || '').trim()}`)
  }
}
if (failed) process.exit(1)
console.log('\nSend one with: groundmail.emails.send({ from, to, template: { id: "<alias>", variables: { ... } } })')
